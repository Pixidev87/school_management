import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import StudentListPage from "../pages/students/StudentListPage";
import StudentFormPage from "../pages/students/StudentFormPage";
import TeacherListPage from "../pages/teachers/TeacherListPage";
import TeacherFormPage from "../pages/teachers/TeacherFormPage";
import SchoolClassListPage from "../pages/classes/SchoolClassListPage";
import SchoolClassFormPage from "../pages/classes/SchoolClassFormPage";
import SubjectListPage from "../pages/subjects/SubjectListPage";
import SubjectFormPage from "../pages/subjects/SubjectFormPage";
import AttendanceRecordPage from '../pages/attendance/AttendanceRecordPage';
import TimetablePage from '../components/timetable/TimetablePage';
import ExamListPage from '../pages/exams/ExamListPage';
import ExamFormPage from '../pages/exams/ExamFormPage';
import ExamResultsPage from '../pages/exams/ExamResultsPage';
import FeeListPage from '../pages/fees/FeeListPage';
import FeeFormPage from '../pages/fees/FeeFormPage';
import OverdueFeesPage from '../pages/fees/OverdueFeesPage';
import LibraryBookListPage from '../pages/library/LibraryBookListPage';
import LibraryBookFormPage from '../pages/library/LibraryBookFormPage';
import IssuesListPage from '../pages/library/IssuesListPage';
import TransportListPage from '../pages/transport/TransportListPage';
import TransportFormPage from '../pages/transport/TransportFormPage';
import TransportDetailPage from '../pages/transport/TransportDetailPage';
import NotificationListPage from '../pages/notifications/NotificationsListPage';
import NotificationFormPage from '../pages/notifications/NotificationFormPage';
import MyNotificationsPage from '../pages/notifications/MyNotificationsPage';
import Layout from "../components/layout/Layout";

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

                    <Route path="/teachers" element={<TeacherListPage />} />
                    <Route
                        path="/teachers/create"
                        element={<TeacherFormPage />}
                    />
                    <Route
                        path="/teachers/:id/edit"
                        element={<TeacherFormPage />}
                    />

                    <Route path="/classes" element={<SchoolClassListPage />} />
                    <Route
                        path="/classes/create"
                        element={<SchoolClassFormPage />}
                    />
                    <Route
                        path="/classes/:id/edit"
                        element={<SchoolClassFormPage />}
                    />

                    <Route path="/subjects" element={<SubjectListPage />} />
                    <Route path="/subjects/create" element={<SubjectFormPage />} />
                    <Route path="/subjects/:id/edit" element={<SubjectFormPage />} />

                    <Route path="/attendances" element={<AttendanceRecordPage />} />

                    <Route path="/timetables" element={<TimetablePage />} />

                    <Route path="/exams" element={<ExamListPage />} />
                    <Route path="/exams/create" element={<ExamFormPage />} />
                    <Route path="/exams/:id/edit" element={<ExamFormPage />} />
                    <Route path="/exams/:id/results" element={<ExamResultsPage />} />

                    <Route path="/fees" element={<FeeListPage />} />
                    <Route path="/fees/create" element={<FeeFormPage />} />
                    <Route path="/fees/:id/edit" element={<FeeFormPage />} />
                    <Route path="/fees/overdue" element={<OverdueFeesPage />} />

                    <Route path="/library" element={<LibraryBookListPage />} />
                    <Route path="/library/books/create" element={<LibraryBookFormPage />} />
                    <Route path="/library/books/:id/edit" element={<LibraryBookFormPage />} />
                    <Route path="/library/issues/:type" element={<IssuesListPage />} />

                    <Route path="/transports" element={<TransportListPage />} />
                    <Route path="/transports/create" element={<TransportFormPage />} />
                    <Route path="/transports/:id" element={<TransportDetailPage />} />
                    <Route path="/transports/:id/edit" element={<TransportFormPage />} />

                    <Route path="/notifications/my" element={<MyNotificationsPage />} />
                    <Route path="/notifications/create" element={<NotificationFormPage />} />
                    <Route path="/notifications" element={<NotificationListPage />} />

                </Route>

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
