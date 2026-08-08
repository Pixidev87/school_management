import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
    const { user, logout } = useAuth();

    const roleLabels = {
        admin: "Adminisztrátor",
        teacher: "Tanár",
        parent: "Szülő",
    };

    return (
        <nav className="navbar navbar-dark bg-primary px-4 shadow-sm">
            <span className="navbar-brand mb-0 h1">School Management</span>

            <div className="d-flex align-items-center text-white gap-3">
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
