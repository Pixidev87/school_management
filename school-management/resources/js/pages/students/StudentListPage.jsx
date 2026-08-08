import { useState } from "react";
import { Link } from "react-router-dom";
import { useStudents, useDeleteStudent } from "../../hooks/useStudents";

export default function StudentListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useStudents(page);
    const deleteStudent = useDeleteStudent();

    function handleDelete(id, name) {
        if (!window.confirm(`Biztosan törlöd ${name} diákot?`)) {
            return;
        }

        deleteStudent.mutate(id);
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
        return (
            <div className="alert alert-danger">
                Hiba történt a diákok betöltése közben.
            </div>
        );
    }

    const students = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Diákok</h1>
                <Link to="/students/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új diák
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Törzsszám</th>
                                <th>Név</th>
                                <th>Email</th>
                                <th>Osztály</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-muted py-4"
                                    >
                                        Még nincs rögzített diák.
                                    </td>
                                </tr>
                            )}

                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.roll_number}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.school_class?.name ?? "—"}</td>
                                    <td className="text-end">
                                        <Link
                                            to={`/students/${student.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(
                                                    student.id,
                                                    student.name,
                                                )
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
                        <li
                            className={`page-item ${page === 1 ? "disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Előző
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">
                                {meta.current_page} / {meta.last_page}
                            </span>
                        </li>
                        <li
                            className={`page-item ${page === meta.last_page ? "disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Következő
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
