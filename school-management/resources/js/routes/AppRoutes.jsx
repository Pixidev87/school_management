import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";

function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Dashboard</h1>
                <button className="btn btn-outline-danger" onClick={logout}>
                    Kijelentkezés
                </button>
            </div>
            <p className="mt-3">
                Üdv, <strong>{user?.name}</strong>! Szerepköröd:{" "}
                <strong>{user?.role}</strong>
            </p>
        </div>
    );
}

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-5">Betöltés...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
