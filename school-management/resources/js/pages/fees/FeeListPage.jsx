import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFees, useDeleteFee, useMarkFeeAsPaid } from '../../hooks/useFees';

const STATUS_LABELS = {
    pending: { label: 'Fizetésre vár', className: 'bg-warning text-dark' },
    paid: { label: 'Befizetve', className: 'bg-success' },
    overdue: { label: 'Lejárt', className: 'bg-danger' },
    waived: { label: 'Elengedve', className: 'bg-secondary' },
};

export default function FeeListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useFees(page);
    const deleteFee = useDeleteFee();
    const markAsPaid = useMarkFeeAsPaid();

    function handleDelete(id, feeType) {
        if (!window.confirm(`Biztosan törlöd ezt a díjat: "${feeType}"?`)) {
            return;
        }

        deleteFee.mutate(id);
    }

    async function handleMarkAsPaid(id) {
        if (!window.confirm('Megerősíted hogy ez a díj befizetésre került?')) {
            return;
        }

        try {
            await markAsPaid.mutateAsync(id);
        } catch (error) {
            alert(error.response?.data?.message || 'Hiba történt a művelet során.');
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
        return <div className="alert alert-danger">Hiba történt a díjak betöltése közben.</div>;
    }

    const fees = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Díjak</h1>
                <div className="d-flex gap-2">
                    <Link to="/fees/overdue" className="btn btn-outline-danger">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Lejárt díjak
                    </Link>
                    <Link to="/fees/create" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i>
                        Új díj
                    </Link>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Diák</th>
                                <th>Típus</th>
                                <th>Összeg</th>
                                <th>Határidő</th>
                                <th>Státusz</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        Még nincs rögzített díj.
                                    </td>
                                </tr>
                            )}

                            {fees.map((fee) => {
                                const statusInfo = STATUS_LABELS[fee.status] ?? {
                                    label: fee.status,
                                    className: 'bg-secondary',
                                };

                                return (
                                    <tr key={fee.id}>
                                        <td>{fee.student?.name ?? '—'}</td>
                                        <td>{fee.fee_type}</td>
                                        <td>{fee.amount} Ft</td>
                                        <td>
                                            {fee.due_date}
                                            {fee.is_overdue && (
                                                <span className="badge bg-danger ms-2">Lejárt</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${statusInfo.className}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            
                                            {fee.status !== 'paid' && (
                                                <button
                                                    className="btn btn-sm btn-outline-success me-2"
                                                    onClick={() => handleMarkAsPaid(fee.id)}
                                                    title="Befizetés jelölése"
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                            )}
                                            <Link
                                                to={`/fees/${fee.id}/edit`}
                                                className="btn btn-sm btn-outline-secondary me-2"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(fee.id, fee.fee_type)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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