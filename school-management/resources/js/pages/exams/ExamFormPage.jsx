import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useClasses } from '../../hooks/useClasses';
import { useSubjectsForDropdown } from '../../hooks/useSubjectsForDropdown';
import { useExam, useCreateExam, useUpdateExam } from '../../hooks/useExams';

const EXAM_TYPES = [
    { value: 'midterm', label: 'Félévi' },
    { value: 'final', label: 'Év végi' },
    { value: 'quiz', label: 'Röpdolgozat' },
    { value: 'assignment', label: 'Házi feladat' },
    { value: 'practical', label: 'Gyakorlati' },
];

export default function ExamFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);

    const { data: classesData } = useClasses();
    const { data: subjectsData } = useSubjectsForDropdown();
    const { data: exam, isLoading: examLoading } = useExam(id);

    const createExam = useCreateExam();
    const updateExam = useUpdateExam(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && exam) {
            reset({
                name: exam.name,
                type: exam.type,
                class_id: exam.school_class?.id ?? '',
                subject_id: exam.subject?.id ?? '',
                exam_date: exam.exam_date ?? '',
                start_time: exam.start_time ?? '',
                end_time: exam.end_time ?? '',
                total_marks: exam.total_marks ?? '',
                passing_marks: exam.passing_marks ?? '',
                room: exam.room ?? '',
            });
        }
    }, [isEditMode, exam, reset]);

    async function onSubmit(data) {
        setServerError(null);

        /**
         * A total_marks és passing_marks számmá alakítása -
         * ugyanaz a minta mint a Subjects modul total_periods-nál.
         * A backend integer típust vár, a number input string-et ad.
         */
        const payload = {
            ...data,
            total_marks: Number(data.total_marks),
            passing_marks: Number(data.passing_marks),
        };

        try {
            if (isEditMode) {
                await updateExam.mutateAsync(payload);
            } else {
                await createExam.mutateAsync(payload);
            }

            navigate('/exams');
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

    const isSubmitting = createExam.isPending || updateExam.isPending;

    if (isEditMode && examLoading) {
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
                {isEditMode ? 'Vizsga szerkesztése' : 'Új vizsga létrehozása'}
            </h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Vizsga neve</label>
                                <input
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="pl. Matematika félévi dolgozat"
                                    {...register('name', { required: 'A vizsga neve kötelező.' })}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">{errors.name.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Típus</label>
                                <select
                                    className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                    {...register('type', { required: 'A típus kiválasztása kötelező.' })}
                                >
                                    <option value="">Válassz...</option>
                                    {EXAM_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <div className="invalid-feedback">{errors.type.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Osztály</label>
                                <select
                                    className={`form-select ${errors.class_id ? 'is-invalid' : ''}`}
                                    {...register('class_id', { required: 'Az osztály kiválasztása kötelező.' })}
                                >
                                    <option value="">Válassz osztályt...</option>
                                    {classesData?.data.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} {cls.section ? `- ${cls.section}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.class_id && (
                                    <div className="invalid-feedback">{errors.class_id.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Tantárgy</label>
                                <select
                                    className={`form-select ${errors.subject_id ? 'is-invalid' : ''}`}
                                    {...register('subject_id', { required: 'A tantárgy kiválasztása kötelező.' })}
                                >
                                    <option value="">Válassz tantárgyat...</option>
                                    {subjectsData?.data.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subject_id && (
                                    <div className="invalid-feedback">{errors.subject_id.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Dátum</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.exam_date ? 'is-invalid' : ''}`}
                                    {...register('exam_date', { required: 'A dátum megadása kötelező.' })}
                                />
                                {errors.exam_date && (
                                    <div className="invalid-feedback">{errors.exam_date.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Kezdés</label>
                                <input type="time" className="form-control" {...register('start_time')} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Befejezés</label>
                                <input type="time" className="form-control" {...register('end_time')} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Elérhető pontszám</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={`form-control ${errors.total_marks ? 'is-invalid' : ''}`}
                                    {...register('total_marks', {
                                        required: 'Az elérhető pontszám kötelező.',
                                    })}
                                />
                                {errors.total_marks && (
                                    <div className="invalid-feedback">{errors.total_marks.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Átmenő pontszám</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={`form-control ${errors.passing_marks ? 'is-invalid' : ''}`}
                                    {...register('passing_marks', {
                                        required: 'Az átmenő pontszám kötelező.',
                                    })}
                                />
                                {errors.passing_marks && (
                                    <div className="invalid-feedback">{errors.passing_marks.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Terem</label>
                                <input className="form-control" {...register('room')} />
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
                                onClick={() => navigate('/exams')}
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