import { useState } from "react";
import { Link } from "react-router-dom";
import {
    useSchoolClasses,
    useDeleteSchoolClass,
} from "../../hooks/useSchoolClasses";

export default function SchoolClassListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useSchoolClasses(page);
    const deleteClass = useDeleteSchoolClass();

    function handleDelete(id, name) {
        if (!window.confirm(`Biztosan törlöd ${name} osztályt?`)) {
            return;
        }

        deleteClass.mutate(id);
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
                Hiba történt az osztályok betöltése közben.
            </div>
        );
    }

    const classes = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Osztályok</h1>
                <Link to="/classes/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Új osztály
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Név</th>
                                <th>Szekció</th>
                                <th>Terem</th>
                                <th>Osztályfőnök</th>
                                <th>Diákok száma</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center text-muted py-4"
                                    >
                                        Még nincs rögzített osztály.
                                    </td>
                                </tr>
                            )}

                            {classes.map((cls) => (
                                <tr key={cls.id}>
                                    <td>{cls.name}</td>
                                    <td>{cls.section ?? "—"}</td>
                                    <td>{cls.room_number ?? "—"}</td>
                                    <td>{cls.class_teacher?.name ?? "—"}</td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {cls.students_count ?? 0}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            to={`/classes/${cls.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(cls.id, cls.name)
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
