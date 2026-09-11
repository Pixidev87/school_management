import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStudentsForDropdown } from '../../hooks/useStudentsForDropdown';
import { useAssignStudent } from '../../hooks/useTransport';

export default function AssignStudentModal({ transport, onClose }) {
    const [serverError, setServerError] = useState(null);

    const { data: studentsData } = useStudentsForDropdown();
    const assignStudent = useAssignStudent(transport.id);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const stops = transport.stops ?? [];

    async function onSubmit(data) {
        setServerError(null);

        try {
            await assignStudent.mutateAsync({
                student_id: Number(data.student_id),
                stop_id: Number(data.stop_id),
            });
            onClose();
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setServerError(
                firstError ||
                    error.response?.data?.message ||
                    'Hiba történt a hozzárendelés során.'
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
                        <h5 className="modal-title">
                            Diák hozzárendelése: {transport.route_name}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {serverError && (
                                <div className="alert alert-danger">{serverError}</div>
                            )}

                            {stops.length === 0 && (
                                <div className="alert alert-warning">
                                    Ehhez a járathoz még nincs megálló. Először adj hozzá megállót.
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Diák</label>
                                <select
                                    className={`form-select ${errors.student_id ? 'is-invalid' : ''}`}
                                    {...register('student_id', {
                                        required: 'A diák kiválasztása kötelező.',
                                    })}
                                >
                                    <option value="">Válassz...</option>
                                    {studentsData?.data?.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.roll_number})
                                        </option>
                                    ))}
                                </select>
                                {errors.student_id && (
                                    <div className="invalid-feedback">{errors.student_id.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Megálló</label>
                                <select
                                    className={`form-select ${errors.stop_id ? 'is-invalid' : ''}`}
                                    disabled={stops.length === 0}
                                    {...register('stop_id', {
                                        required: 'A megálló kiválasztása kötelező.',
                                    })}
                                >
                                    <option value="">Válassz...</option>
                                    {stops.map((stop) => (
                                        <option key={stop.id} value={stop.id}>
                                            {stop.stop_name}
                                            {stop.pickup_time ? ` (${stop.pickup_time})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.stop_id && (
                                    <div className="invalid-feedback">{errors.stop_id.message}</div>
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
                                disabled={assignStudent.isPending || stops.length === 0}
                            >
                                {assignStudent.isPending ? 'Mentés...' : 'Hozzárendelés'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
