import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExams, useDeleteExam } from '../../hooks/useExams';

const TYPE_LABELS = {
    midterm: 'Félévi',
    final: 'Év végi',
    quiz: 'Röpdolgozat',
    assignment: 'Házi feladat',
    practical: 'Gyakorlati',
};

export default function ExamListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useExams(page);
    const deleteExam = useDeleteExam();

    function handleDelete(id, name) {
        if (!window.confirm(`Biztosan törlöd a(z) "${name}" vizsgát?`)) {
            return;
        }

        deleteExam.mutate(id);
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
        return <div className="alert alert-danger">Hiba történt a vizsgák betöltése közben.</div>;
    }

    const exams = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Vizsgák</h1>
                <Link to="/exams/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új vizsga
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Név</th>
                                <th>Típus</th>
                                <th>Osztály</th>
                                <th>Tantárgy</th>
                                <th>Dátum</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        Még nincs rögzített vizsga.
                                    </td>
                                </tr>
                            )}

                            {exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>{exam.name}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {TYPE_LABELS[exam.type] ?? exam.type}
                                        </span>
                                    </td>
                                    <td>{exam.school_class?.name ?? '—'}</td>
                                    <td>{exam.subject?.name ?? '—'}</td>
                                    <td>{exam.exam_date}</td>
                                    <td className="text-end">
                                        <Link
                                            to={`/exams/${exam.id}/results`}
                                            className="btn btn-sm btn-outline-success me-2"
                                            title="Eredmények rögzítése"
                                        >
                                            <i className="bi bi-clipboard-check"></i>
                                        </Link>
                                        <Link
                                            to={`/exams/${exam.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(exam.id, exam.name)}
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