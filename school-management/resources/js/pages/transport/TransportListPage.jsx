import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteTransport, useTransports } from '../../hooks/useTransport';
import AssignStudentModal from '../../components/transport/AssignStudentModal';

export default function TransportListPage() {
    const [page, setPage] = useState(1);
    const [assignModalTransport, setAssignModalTransport] = useState(null);

    const { data, isLoading, isError } = useTransports(page);
    const deleteTransport = useDeleteTransport();

    function handleDelete(id, routeName) {
        if (!window.confirm(`Biztosan törlöd a(z) "${routeName}" járatot?`)) {
            return;
        }

        deleteTransport.mutate(id);
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
        return <div className="alert alert-danger">Hiba történt a járatok betöltése közben.</div>;
    }

    const transports = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Közlekedés</h1>
                <Link to="/transports/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új járat
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Útvonal</th>
                                <th>Rendszám</th>
                                <th>Sofőr</th>
                                <th>Férőhely</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transports.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        Még nincs rögzített járat.
                                    </td>
                                </tr>
                            )}

                            {transports.map((transport) => (
                                <tr key={transport.id}>
                                    <td>{transport.route_name}</td>
                                    <td>{transport.vehicle_number}</td>
                                    <td>
                                        {transport.driver_name}
                                        <div className="text-muted small">{transport.driver_phone}</div>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                transport.is_full ? 'bg-secondary' : 'bg-success'
                                            }`}
                                        >
                                            {transport.students_count ?? 0} / {transport.capacity}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        {!transport.is_full && (
                                            <button
                                                className="btn btn-sm btn-outline-success me-2"
                                                onClick={() => setAssignModalTransport(transport)}
                                                title="Diák hozzárendelése"
                                            >
                                                <i className="bi bi-person-plus"></i>
                                            </button>
                                        )}
                                        <Link
                                            to={`/transports/${transport.id}`}
                                            className="btn btn-sm btn-outline-primary me-2"
                                            title="Részletek"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Link>
                                        <Link
                                            to={`/transports/${transport.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(transport.id, transport.route_name)
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

            {assignModalTransport && (
                <AssignStudentModal
                    transport={assignModalTransport}
                    onClose={() => setAssignModalTransport(null)}
                />
            )}
        </div>
    );
}
