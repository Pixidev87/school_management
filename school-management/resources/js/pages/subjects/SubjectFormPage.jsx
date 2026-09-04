import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeachersForDropdown } from '../../hooks/useTeachersForDropdown';
import { useSubject, useCreateSubject, useUpdateSubject } from '../../hooks/useSubjects';

export default function SubjectFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);

    const { data: teachersData } = useTeachersForDropdown();
    const { data: subject, isLoading: subjectLoading } = useSubject(id);

    const createSubject = useCreateSubject();
    const updateSubject = useUpdateSubject(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && subject) {
            reset({
                name: subject.name,
                code: subject.code,
                total_periods: subject.total_periods ?? '',
                teacher_id: subject.teacher?.id ?? '',
            });
        }
    }, [isEditMode, subject, reset]);

    async function onSubmit(data) {
        setServerError(null);

        const payload = {
            ...data,
            teacher_id: data.teacher_id || null,
            total_periods: data.total_periods ? Number(data.total_periods) : null,
        };

        try {
            if (isEditMode) {
                await updateSubject.mutateAsync(payload);
            } else {
                await createSubject.mutateAsync(payload);
            }

            navigate('/subjects');
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

    const isSubmitting = createSubject.isPending || updateSubject.isPending;

    if (isEditMode && subjectLoading) {
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
                {isEditMode ? 'Tantárgy szerkesztése' : 'Új tantárgy létrehozása'}
            </h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Tantárgy neve</label>
                                <input
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    {...register('name', { required: 'A tantárgy neve kötelező.' })}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Kód</label>
                                <input
                                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                    placeholder="pl. MATH01"
                                    {...register('code', { required: 'A tantárgy kódja kötelező.' })}
                                />
                                {errors.code && (
                                    <div className="invalid-feedback">{errors.code.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Tanár</label>
                                <select className="form-select" {...register('teacher_id')}>
                                    <option value="">Nincs kijelölve</option>
                                    {teachersData?.data.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Óraszám (heti)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    {...register('total_periods')}
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
                                onClick={() => navigate('/subjects')}
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