import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useLibraryBook,
    useCreateLibraryBook,
    useUpdateLibraryBook,
} from '../../hooks/useLibrary';

export default function LibraryBookFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);

    const { data: book, isLoading: bookLoading } = useLibraryBook(id);
    const createBook = useCreateLibraryBook();
    const updateBook = useUpdateLibraryBook(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && book) {
            reset({
                title: book.title,
                author: book.author ?? '',
                isbn: book.isbn ?? '',
                category: book.category ?? '',
                total_copies: book.total_copies ?? 1,
                available_copies: book.available_copies ?? 1,
            });
        }
    }, [isEditMode, book, reset]);

    async function onSubmit(data) {
        setServerError(null);

        const payload = {
            ...data,
            total_copies: Number(data.total_copies),
            available_copies: Number(data.available_copies),
        };

        try {
            if (isEditMode) {
                await updateBook.mutateAsync(payload);
            } else {
                await createBook.mutateAsync(payload);
            }

            navigate('/library');
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setServerError(
                firstError || error.response?.data?.message || 'Hiba történt a mentés során.'
            );
        }
    }

    const isSubmitting = createBook.isPending || updateBook.isPending;

    if (isEditMode && bookLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Betöltés...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="h3 mb-4">
                {isEditMode ? 'Könyv szerkesztése' : 'Új könyv hozzáadása'}
            </h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cím</label>
                                <input
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    {...register('title', { required: 'A könyv címe kötelező.' })}
                                />
                                {errors.title && (
                                    <div className="invalid-feedback">{errors.title.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Szerző</label>
                                <input className="form-control" {...register('author')} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">ISBN</label>
                                <input className="form-control" {...register('isbn')} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Kategória</label>
                                <input className="form-control" {...register('category')} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Összes példány</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={`form-control ${errors.total_copies ? 'is-invalid' : ''}`}
                                    {...register('total_copies', {
                                        required: 'A példányszám megadása kötelező.',
                                    })}
                                />
                                {errors.total_copies && (
                                    <div className="invalid-feedback">{errors.total_copies.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Elérhető példány</label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`form-control ${errors.available_copies ? 'is-invalid' : ''}`}
                                    {...register('available_copies', {
                                        required: 'Az elérhető példányszám kötelező.',
                                    })}
                                />
                                {errors.available_copies && (
                                    <div className="invalid-feedback">
                                        {errors.available_copies.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Mentés...' : 'Mentés'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/library')}
                            >
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}