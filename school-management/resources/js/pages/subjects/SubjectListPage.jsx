import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubjects, useDeleteSubject } from '../../hooks/useSubjects';

export default function SubjectListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useSubjects(page);
    const deleteSubject = useDeleteSubject();

    function handleDelete(id, name) {
        if (!window.confirm(`Biztosan törlöd ${name} tantárgyat?`)) {
            return;
        }

        deleteSubject.mutate(id);
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
        return <div className="alert alert-danger">Hiba történt a tantárgyak betöltése közben.</div>;
    }

    const subjects = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Tantárgyak</h1>
                <Link to="/subjects/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új tantárgy
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Kód</th>
                                <th>Név</th>
                                <th>Tanár</th>
                                <th>Óraszám</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        Még nincs rögzített tantárgy.
                                    </td>
                                </tr>
                            )}

                            {subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {subject.code}
                                        </span>
                                    </td>
                                    <td>{subject.name}</td>
                                    <td>{subject.teacher?.name ?? '—'}</td>
                                    <td>{subject.total_periods ?? '—'}</td>
                                    <td className="text-end">
                                        <Link
                                            to={`/subjects/${subject.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(subject.id, subject.name)}
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
        </div>
    );
}