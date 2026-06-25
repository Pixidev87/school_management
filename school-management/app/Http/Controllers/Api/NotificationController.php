<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{

    public function __construct(
        private NotificationService $notificationService
    ) {}

    // Az összes értesítés listázása lapozással..
    public function index(): AnonymousResourceCollection
    {
        $notification = $this->notificationService->getAllNotification();
        return NotificationResource::collection($notification);
    }

    // Új értesítés létrehozása.. Bejelentkezett felhasználót átadjuk a servicenek mint creator..
    public function store(StoreNotificationRequest $request): NotificationResource
    {
        $notification = $this->notificationService->createNotification(
            $request->validated(),
            auth()->user()
        );

        return new NotificationResource($notification);
    }

    // Egy értesités az összes adatával..
    public function show(int $id): NotificationResource
    {
        $notification = $this->notificationService->getNotificationById($id);
        return new NotificationResource($notification);
    }

    // Értesítés törlése (soft delete)
    public function destroy(int $id): JsonResponse
    {
        $notification = $this->notificationService->getNotificationById($id);
        $this->notificationService->deleteNotification($notification);

        return response()->json([
            'message' => 'Értesítés törlése sikeres!'
        ]);
    }

    // Értesítés olvasottnak jelölése..
    public function markAsRead(int $id): JsonResponse
    {
        $notification = $this->notificationService->getNotificationById($id);
        $this->notificationService->markAsRead(
            $notification,
            auth()->user()
        );

        return response()->json([
            'message' => 'Értesítés olvasottnak jelölve!'
        ]);
    }

    // Bejelentkezett felhasználó olvasatlan értesítéseinek a száma..
    public function unreadCount(): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount(auth()->user());
        return response()->json([
            'data' => ['count' => $count]
        ]);
    }

    // Bejelentkezett felhasználó értesítései..
    public function userNotifications(): AnonymousResourceCollection
    {
        $notifications = $this->notificationService->getUserNotifications(auth()->user());

        return NotificationResource::collection($notifications);
    }
}
