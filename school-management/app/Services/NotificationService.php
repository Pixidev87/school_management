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
}
