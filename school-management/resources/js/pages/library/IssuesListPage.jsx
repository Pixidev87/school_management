import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useActiveIssues, useOverdueIssues, useReturnBook } from '../../hooks/useLibrary';

export default function IssuesListPage() {
    const { type } = useParams();
    const isOverdue = type === 'overdue';

    const [page, setPage] = useState(1);

    const activeQuery = useActiveIssues(page);
    const overdueQuery = useOverdueIssues(page);

    const { data, isLoading, isError } = isOverdue ? overdueQuery : activeQuery;
    const returnBook = useReturnBook();

    async function handleReturn(issueId) {
        if (!window.confirm('Megerősíted hogy a könyv visszahozásra került?')) {
            return;
        }

        try {
            await returnBook.mutateAsync(issueId);
        } catch (error) {
            alert(error.response?.data?.message || 'Hiba történt a visszahozás során.');
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
        return <div className="alert alert-danger">Hiba történt a kölcsönzések betöltése közben.</div>;
    }

    const issues = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">
                    {isOverdue ? 'Lejárt kölcsönzések' : 'Aktív kölcsönzések'}
                </h1>
                <Link to="/library" className="btn btn-outline-secondary">
                    Vissza a könyvekhez
                </Link>
            </div>

            {issues.length === 0 && (
                <div className="alert alert-info">
                    {isOverdue
                        ? 'Nincs lejárt kölcsönzés.'
                        : 'Nincs jelenleg aktív kölcsönzés.'}
                </div>
            )}

            {issues.length > 0 && (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Könyv</th>
                                    <th>Kölcsönző</th>
                                    <th>Kölcsönzés dátuma</th>
                                    <th>Határidő</th>
                                    <th className="text-end">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue.id}>
                                        <td>{issue.book?.title}</td>
                                        <td>
                                            {issue.student?.name ?? issue.teacher?.name ?? '—'}
                                        </td>
                                        <td>{issue.issue_date}</td>
                                        <td className={isOverdue ? 'text-danger fw-semibold' : ''}>
                                            {issue.due_date}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleReturn(issue.id)}
                                            >
                                                <i className="bi bi-box-arrow-in-left me-1"></i>
                                                Visszahozás
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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