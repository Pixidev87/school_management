import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStudentsForDropdown } from '../../hooks/useStudentsForDropdown';
import { useTeachersForDropdown } from '../../hooks/useTeachersForDropdown';
import { useIssueBook } from '../../hooks/useLibrary';

export default function IssueBookModal({ book, onClose }) {
    const [borrowerType, setBorrowerType] = useState('student');
    const [serverError, setServerError] = useState(null);

    const { data: studentsData } = useStudentsForDropdown();
    const { data: teachersData } = useTeachersForDropdown();
    const issueBook = useIssueBook(book.id);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function onSubmit(data) {
        setServerError(null);

        const payload = {
            student_id: borrowerType === 'student' ? data.borrower_id : null,
            teacher_id: borrowerType === 'teacher' ? data.borrower_id : null,
            due_date: data.due_date,
        };

        try {
            await issueBook.mutateAsync(payload);
            onClose();
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setServerError(
                firstError || error.response?.data?.message || 'Hiba történt a kölcsönzés során.'
            );
        }
    }

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Könyv kölcsönzése: {book.title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {serverError && (
                                <div className="alert alert-danger">{serverError}</div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Kölcsönző típusa</label>
                                <div className="btn-group w-100" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${
                                            borrowerType === 'student'
                                                ? 'btn-primary'
                                                : 'btn-outline-primary'
                                        }`}
                                        onClick={() => setBorrowerType('student')}
                                    >
                                        Diák
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${
                                            borrowerType === 'teacher'
                                                ? 'btn-primary'
                                                : 'btn-outline-primary'
                                        }`}
                                        onClick={() => setBorrowerType('teacher')}
                                    >
                                        Tanár
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    {borrowerType === 'student' ? 'Diák' : 'Tanár'}
                                </label>
                                <select
                                    className={`form-select ${errors.borrower_id ? 'is-invalid' : ''}`}
                                    {...register('borrower_id', {
                                        required: 'A kölcsönző kiválasztása kötelező.',
                                    })}
                                >
                                    <option value="">Válassz...</option>
                                    {borrowerType === 'student'
                                        ? studentsData?.data.map((s) => (
                                              <option key={s.id} value={s.id}>
                                                  {s.name} ({s.roll_number})
                                              </option>
                                          ))
                                        : teachersData?.data.map((t) => (
                                              <option key={t.id} value={t.id}>
                                                  {t.name}
                                              </option>
                                          ))}
                                </select>
                                {errors.borrower_id && (
                                    <div className="invalid-feedback">{errors.borrower_id.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Visszahozási határidő</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.due_date ? 'is-invalid' : ''}`}
                                    {...register('due_date', {
                                        required: 'A határidő megadása kötelező.',
                                    })}
                                />
                                {errors.due_date && (
                                    <div className="invalid-feedback">{errors.due_date.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Mégse
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={issueBook.isPending}
                            >
                                {issueBook.isPending ? 'Kölcsönzés...' : 'Kölcsönzés'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}