import { useAuth } from "../hooks/useAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";

function StatCard({ title, value, icon, color }) {
    return (
        <div className="col-md-3 mb-4">
            <div
                className={`card border-0 shadow-sm border-start border-${color} border-4`}
            >
                <div className="card-body d-flex align-items-center gap-3">
                    <div className={`fs-2 text-${color}`}>
                        <i className={`bi ${icon}`}></i>
                    </div>
                    <div>
                        <div className="text-muted small">{title}</div>
                        <div className="fs-4 fw-bold">{value}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();

    const { data: stats, isLoading, isError } = useDashboardStats();

    const roleLabels = {
        admin: "Adminisztrátor",
        teacher: "Tanár",
        parent: "Szülő",
    };

    return (
        <div>
            <h1 className="h3 mb-1">Üdvözlünk, {user?.name}!</h1>
            <p className="text-muted mb-4">
                Bejelentkezve mint {roleLabels[user?.role]}
            </p>

            {isAdmin && (
                <>
                    {isLoading && (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Betöltés...
                                </span>
                            </div>
                        </div>
                    )}

                    {isError && (
                        <div className="alert alert-danger">
                            Hiba történt az áttekintő adatok betöltése közben.
                        </div>
                    )}

                    {stats && (
                        <div className="row">
                            <StatCard
                                title="Diákok"
                                value={stats.studentsCount}
                                icon="bi-people-fill"
                                color="primary"
                            />
                            <StatCard
                                title="Tanárok"
                                value={stats.teachersCount}
                                icon="bi-person-badge-fill"
                                color="success"
                            />
                            <StatCard
                                title="Osztályok"
                                value={stats.classesCount}
                                icon="bi-building"
                                color="info"
                            />
                            <StatCard
                                title="Lejárt díjak"
                                value={stats.overdueFeesCount}
                                icon="bi-exclamation-triangle-fill"
                                color="danger"
                            />
                        </div>
                    )}
                </>
            )}

            {!isAdmin && (
                <div className="alert alert-info">
                    A részletes áttekintő hamarosan elérhető lesz a
                    szerepkörödhöz.
                </div>
            )}
        </div>
    );
}
