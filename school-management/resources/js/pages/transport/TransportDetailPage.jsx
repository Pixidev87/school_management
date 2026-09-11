import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRemoveStudent, useTransport } from '../../hooks/useTransport';
import AssignStudentModal from '../../components/transport/AssignStudentModal';

export default function TransportDetailPage() {
    const { id } = useParams();
    const [showAssignModal, setShowAssignModal] = useState(false);

    const { data: transport, isLoading, isError } = useTransport(id);
    const removeStudent = useRemoveStudent();

    async function handleRemove(studentId, studentName) {
        if (!window.confirm(`Eltávolítod ${studentName} diákot erről a járatról?`)) {
            return;
        }

        try {
            await removeStudent.mutateAsync({
                transportId: Number(id),
                studentId,
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Hiba történt az eltávolítás során.');
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

    if (isError || !transport) {
        return <div className="alert alert-danger">Hiba történt a járat betöltése közben.</div>;
    }

    const stops = transport.stops ?? [];
    const students = transport.students ?? [];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">{transport.route_name}</h1>
                    <div className="text-muted">
                        {transport.vehicle_number} · {transport.driver_name} · {transport.driver_phone}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/transports" className="btn btn-outline-secondary">
                        Vissza a járatokhoz
                    </Link>
                    <Link to={`/transports/${transport.id}/edit`} className="btn btn-outline-primary">
                        Szerkesztés
                    </Link>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAssignModal(true)}
                        disabled={transport.is_full}
                    >
                        <i className="bi bi-person-plus me-1"></i>
                        Diák hozzárendelése
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <strong>Megállók</strong>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Megálló</th>
                                        <th>Felszállás</th>
                                        <th>Leszállás</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stops.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                Nincs megálló.
                                            </td>
                                        </tr>
                                    )}
                                    {stops.map((stop) => (
                                        <tr key={stop.id}>
                                            <td>{stop.order}</td>
                                            <td>{stop.stop_name}</td>
                                            <td>{stop.pickup_time ?? '—'}</td>
                                            <td>{stop.drop_time ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between">
                            <strong>Hozzárendelt diákok</strong>
                            <span className="badge bg-primary">
                                {students.length} / {transport.capacity}
                            </span>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Diák</th>
                                        <th>Azonosító</th>
                                        <th>Megálló</th>
                                        <th className="text-end">Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                Még nincs diák ezen a járaton.
                                            </td>
                                        </tr>
                                    )}
                                    {students.map((assignment) => (
                                        <tr key={assignment.id}>
                                            <td>{assignment.student?.name ?? '—'}</td>
                                            <td>{assignment.student?.roll_number ?? '—'}</td>
                                            <td>{assignment.stop?.stop_name ?? '—'}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleRemove(
                                                            assignment.student_id,
                                                            assignment.student?.name ?? 'a'
                                                        )
                                                    }
                                                >
                                                    Eltávolítás
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showAssignModal && (
                <AssignStudentModal
                    transport={transport}
                    onClose={() => setShowAssignModal(false)}
                />
            )}
        </div>
    );
}
