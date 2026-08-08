import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/layout/Layout";
import StudentListPage from "../pages/students/StudentListPage";
import StudentFormPage from "../pages/students/StudentFormPage";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Betöltés...</span>
                </div>
            </div>
        );
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
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/students" element={<StudentListPage />} />
                    <Route
                        path="/students/create"
                        element={<StudentFormPage />}
                    />
                    <Route
                        path="/students/:id/edit"
                        element={<StudentFormPage />}
                    />
                </Route>

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
