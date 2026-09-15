import { useMyNotifications, useMarkAsRead } from '../../hooks/useNotifications';

export default function MyNotificationsPage() {
    const { data: notifications, isLoading, isError } = useMyNotifications();
    const markAsRead = useMarkAsRead();

    async function handleMarkAsRead(id) {
        try {
            await markAsRead.mutateAsync(id);
        } catch (error) {
            alert(error.response?.data?.message || 'Hiba történt.');
        }
    }

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Betöltés...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger">
                Hiba történt az értesítések betöltése közben.
            </div>
        );
    }

    return (
        <div>
            <h1 className="h3 mb-4">Saját értesítések</h1>

            {notifications.length === 0 && (
                <div className="alert alert-info">
                    Nincs értesítésed.
                </div>
            )}

            <div className="d-flex flex-column gap-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`card shadow-sm border-start border-4 ${
                            notification.is_read
                                ? 'border-secondary opacity-75'
                                : 'border-primary'
                        }`}
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="card-title mb-1">
                                        {!notification.is_read && (
                                            <span className="badge bg-primary me-2">Új</span>
                                        )}
                                        {notification.title}
                                    </h5>
                                    <p className="card-text text-muted mb-2">
                                        {notification.message}
                                    </p>
                                    <small className="text-muted">
                                        {notification.created_at}
                                    </small>
                                </div>
                                {!notification.is_read && (
                                    <button
                                        className="btn btn-sm btn-outline-primary ms-3 flex-shrink-0"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        disabled={markAsRead.isPending}
                                    >
                                        Olvasottnak jelölés
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
