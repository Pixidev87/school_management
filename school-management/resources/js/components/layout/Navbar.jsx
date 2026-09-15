import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUnreadCount } from '../../hooks/useNotifications';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { data: unreadData } = useUnreadCount();

    const unreadCount = unreadData?.count ?? 0;

    const roleLabels = {
        admin: 'Adminisztrátor',
        teacher: 'Tanár',
        parent: 'Szülő',
    };

    return (
        <nav className="navbar navbar-dark bg-primary px-4 shadow-sm">
            <span className="navbar-brand mb-0 h1">School Management</span>

            <div className="d-flex align-items-center text-white gap-3">
                <Link
                    to="/notifications/my"
                    className="text-white text-decoration-none position-relative"
                    title="Értesítések"
                >
                    <i className="bi bi-bell fs-5"></i>
                    {unreadCount > 0 && (
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: '0.65rem' }}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>

                <div className="text-end">
                    <div className="fw-semibold">{user?.name}</div>
                    <small className="opacity-75">
                        {roleLabels[user?.role] || user?.role}
                    </small>
                </div>

                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={logout}
                >
                    Kijelentkezés
                </button>
            </div>
        </nav>
    );
}
