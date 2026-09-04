import { useState } from "react";
import { Link } from "react-router-dom";
import { useTeachers, useDeleteTeacher } from "../../hooks/useTeachers";

export default function TeacherListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useTeachers(page);
    const deleteTeacher = useDeleteTeacher();

    function handleDelete(id, name) {
        if (!window.confirm(`Biztosan törlöd ${name} tanárt?`)) {
            return;
        }

        deleteTeacher.mutate(id);
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
                Hiba történt a tanárok betöltése közben.
            </div>
        );
    }

    const teachers = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Tanárok</h1>
                <Link to="/teachers/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új tanár
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Név</th>
                                <th>Email</th>
                                <th>Végzettség</th>
                                <th>Telefonszám</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-muted py-4"
                                    >
                                        Még nincs rögzített tanár.
                                    </td>
                                </tr>
                            )}

                            {teachers.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.qualification ?? "—"}</td>
                                    <td>{teacher.phone ?? "—"}</td>
                                    <td className="text-end">
                                        <Link
                                            to={`/teachers/${teacher.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(
                                                    teacher.id,
                                                    teacher.name,
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
