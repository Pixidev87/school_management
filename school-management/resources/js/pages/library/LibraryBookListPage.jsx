import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    useLibraryBooks,
    useDeleteLibraryBook,
} from '../../hooks/useLibrary';
import IssueBookModal from '../../components/library/IssueBookModal';

export default function LibraryBookListPage() {
    const [page, setPage] = useState(1);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [issueModalBook, setIssueModalBook] = useState(null);

    const { data, isLoading, isError } = useLibraryBooks(page, onlyAvailable);
    const deleteBook = useDeleteLibraryBook();

    function handleDelete(id, title) {
        if (!window.confirm(`Biztosan törlöd "${title}" könyvet?`)) {
            return;
        }

        deleteBook.mutate(id);
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
        return <div className="alert alert-danger">Hiba történt a könyvek betöltése közben.</div>;
    }

    const books = data.data;
    const meta = data.meta;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Könyvtár</h1>
                <div className="d-flex gap-2">
                    <Link to="/library/issues/active" className="btn btn-outline-primary">
                        Aktív kölcsönzések
                    </Link>
                    <Link to="/library/issues/overdue" className="btn btn-outline-danger">
                        Lejárt kölcsönzések
                    </Link>
                    <Link to="/library/books/create" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i>
                        Új könyv
                    </Link>
                </div>
            </div>

            <div className="form-check mb-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="onlyAvailable"
                    checked={onlyAvailable}
                    onChange={(e) => {
                        setOnlyAvailable(e.target.checked);
                        setPage(1);
                    }}
                />
                <label className="form-check-label" htmlFor="onlyAvailable">
                    Csak az elérhető könyvek mutatása
                </label>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Cím</th>
                                <th>Szerző</th>
                                <th>ISBN</th>
                                <th>Elérhető</th>
                                <th className="text-end">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        Még nincs rögzített könyv.
                                    </td>
                                </tr>
                            )}

                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author ?? '—'}</td>
                                    <td>{book.isbn ?? '—'}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                book.is_available ? 'bg-success' : 'bg-secondary'
                                            }`}
                                        >
                                            {book.available_copies} / {book.total_copies}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        {book.is_available && (
                                            <button
                                                className="btn btn-sm btn-outline-success me-2"
                                                onClick={() => setIssueModalBook(book)}
                                                title="Kölcsönzés"
                                            >
                                                <i className="bi bi-box-arrow-right"></i>
                                            </button>
                                        )}
                                        <Link
                                            to={`/library/books/${book.id}/edit`}
                                            className="btn btn-sm btn-outline-secondary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(book.id, book.title)}
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

            {issueModalBook && (
                <IssueBookModal
                    book={issueModalBook}
                    onClose={() => setIssueModalBook(null)}
                />
            )}
        </div>
    );
}