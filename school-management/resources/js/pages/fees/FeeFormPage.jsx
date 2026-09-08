import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudentsForDropdown } from '../../hooks/useStudentsForDropdown';
import { useFee, useCreateFee, useUpdateFee } from '../../hooks/useFees';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Fizetésre vár' },
    { value: 'paid', label: 'Befizetve' },
    { value: 'overdue', label: 'Lejárt' },
    { value: 'waived', label: 'Elengedve' },
];

export default function FeeFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);

    const { data: studentsData } = useStudentsForDropdown();
    const { data: fee, isLoading: feeLoading } = useFee(id);

    const createFee = useCreateFee();
    const updateFee = useUpdateFee(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && fee) {
            reset({
                student_id: fee.student?.id ?? '',
                fee_type: fee.fee_type,
                amount: fee.amount ?? '',
                due_date: fee.due_date ?? '',
                status: fee.status ?? 'pending',
                note: fee.note ?? '',
            });
        }
    }, [isEditMode, fee, reset]);

    async function onSubmit(data) {
        setServerError(null);

        const payload = {
            ...data,
            amount: Number(data.amount),
        };

        try {
            if (isEditMode) {
                await updateFee.mutateAsync(payload);
            } else {
                await createFee.mutateAsync(payload);
            }

            navigate('/fees');
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

    const isSubmitting = createFee.isPending || updateFee.isPending;

    if (isEditMode && feeLoading) {
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
                {isEditMode ? 'Díj szerkesztése' : 'Új díj létrehozása'}
            </h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Diák</label>
                                <select
                                    className={`form-select ${errors.student_id ? 'is-invalid' : ''}`}
                                    {...register('student_id', {
                                        required: 'A diák kiválasztása kötelező.',
                                    })}
                                >
                                    <option value="">Válassz diákot...</option>
                                    {studentsData?.data.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.roll_number})
                                        </option>
                                    ))}
                                </select>
                                {errors.student_id && (
                                    <div className="invalid-feedback">{errors.student_id.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Díj típusa</label>
                                <input
                                    className={`form-control ${errors.fee_type ? 'is-invalid' : ''}`}
                                    placeholder="pl. Tandíj, Étkezés, Kirándulás"
                                    {...register('fee_type', {
                                        required: 'A díj típusa kötelező.',
                                    })}
                                />
                                {errors.fee_type && (
                                    <div className="invalid-feedback">{errors.fee_type.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Összeg (Ft)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                    {...register('amount', {
                                        required: 'Az összeg megadása kötelező.',
                                    })}
                                />
                                {errors.amount && (
                                    <div className="invalid-feedback">{errors.amount.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Határidő</label>
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

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Státusz</label>
                                <select className="form-select" {...register('status')}>
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Megjegyzés</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    {...register('note')}
                                />
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
                                onClick={() => navigate('/fees')}
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