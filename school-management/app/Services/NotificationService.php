<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Notification_read;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{

    // Összes értesítés lekérdezése..
    public function getAllNotification(int $perPage = 15): LengthAwarePaginator
    {
        return Notification::with(['creator'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    // Új értesítés létrehozása..
    // A sent_at azért jön létre mert létrehozni és kiküldeni lehet más időpontban is. Ez 0-a marad amig ki nem küldik.
    public function createNotification(array $data, User $creator): Notification
    {
        return Notification::create([
            ...$data,
            'created_by' => $creator->id,
            'sent_at' => now(),
        ]);
    }

    // Értesítés olvasottnak jelölése..
    // firstOrCreate megakadályozza, hogy valaki ugyanazt az értesítést olvasottnak jelölje még1x.
    public function markAsRead(Notification $notification, User $user): void
    {
        Notification_read::firstOrCreate(
            [
                'notification_id' => $notification->id,
                'user_id' => $user->id,
            ],
            [
                'read_at' => now(),
            ]
        );
    }

    // Egy felhasználó olvasatlan értesítéseinek a száma..
    // whereDoesntHave - azok az értesítések ahol nemlétezik olvasási bejegyzés a felhasználóhoz
    public function getUnreadCount(User $user): int
    {
        return Notification::whereDoesntHave('reads', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();
    }

    // Egy értesítés lekérdezése id alapján.. Ez a Controllernek a show(), update() és destroy() metódusához lehet szükséges..
    public function getNotificationById(int $id): Notification
    {
        return Notification::with(['creator', 'reads'])->findOrFail($id);
    }

    // Értesítés törlése..
    public function deleteNotification(Notification $notification): void
    {
        $notification->delete();
    }

    // Egy felhasználó értesítése (olvasott, olvasatlan).. withCount(), hogy a frontend lássa hány felhasználó olvasta el az értesítést..
    public function getUserNotifications(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Notification::withCount('reads')
            ->where('target', 'all')
            ->orWhere(function ($query) use ($user) {
                $query->where('target', 'students')
                    ->orWhere('target', 'teachers')
                    ->orWhere('target', 'parents');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
