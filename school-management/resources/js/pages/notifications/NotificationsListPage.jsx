import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    useNotifications,
    useDeleteNotification,
} from '../../hooks/useNotifications';

const TYPE_LABELS = {
    notice: 'Közlemény',
    announcement: 'Hirdetmény',
    reminder: 'Emlékeztető',
    alert: 'Figyelmeztetés',
};

const TARGET_LABELS = {
    all: 'Mindenki',
    students: 'Diákok',
    teachers: 'Tanárok',
    parents: 'Szülők',
};

export default function NotificationListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useNotifications(page);
    const deleteNotification = useDeleteNotification();

    function handleDelete(id, title) {
        if (!window.confirm(`Biztosan törlöd "${title}" értesítést?`)) {
            return;
        }

        deleteNotification.mutate(id);
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

    const notifications = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Értesítések</h1>
                <Link to="/notifications/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új értesítés
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Cím</th>
                                <th>Típus</th>
                                <th>Címzett</th>
                                <th>Küldés időpontja</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        Még nincs értesítés.
                                    </td>
                                </tr>
                            )}

                            {notifications.map((notification) => (
                                <tr key={notification.id}>
                                    <td>
                                        <div className="fw-semibold">{notification.title}</div>
                                        <div className="text-muted small">
                                            {notification.message?.substring(0, 60)}
                                            {notification.message?.length > 60 ? '...' : ''}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {TYPE_LABELS[notification.type] ?? notification.type}
                                        </span>
                                    </td>
                                    <td>
                                        {TARGET_LABELS[notification.target_role] ??
                                            notification.target_role}
                                    </td>
                                    <td>{notification.created_at}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(notification.id, notification.title)
                                            }
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {meta && meta.last_page > 1 && (
                <nav className="mt-3">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                                Előző
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">
                                {meta.current_page} / {meta.last_page}
                            </span>
                        </li>
                        <li className={`page-item ${page === meta.last_page ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                                Következő
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
