import { Link } from 'react-router-dom';
import { useOverdueFees, useMarkFeeAsPaid } from '../../hooks/useFees';

export default function OverdueFeesPage() {
    const { data, isLoading, isError } = useOverdueFees();
    const markAsPaid = useMarkFeeAsPaid();

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
        return <div className="alert alert-danger">Hiba történt a lejárt díjak betöltése közben.</div>;
    }

    const fees = data.data;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Lejárt díjak</h1>
                <Link to="/fees" className="btn btn-outline-secondary">
                    Vissza az összes díjhoz
                </Link>
            </div>

            {fees.length === 0 && (
                <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Nincs lejárt, be nem fizetett díj.
                </div>
            )}

            {fees.length > 0 && (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Diák</th>
                                    <th>Típus</th>
                                    <th>Összeg</th>
                                    <th>Határidő</th>
                                    <th className="text-end">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.map((fee) => (
                                    <tr key={fee.id}>
                                        <td>{fee.student?.name ?? '—'}</td>
                                        <td>{fee.fee_type}</td>
                                        <td>{fee.amount} Ft</td>
                                        <td className="text-danger fw-semibold">{fee.due_date}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleMarkAsPaid(fee.id)}
                                            >
                                                <i className="bi bi-check-lg me-1"></i>
                                                Befizetve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}