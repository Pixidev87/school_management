import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSubjectsForDropdown } from '../../hooks/useSubjectsForDropdown';
import { useTeachersForDropdown } from '../../hooks/useTeachersForDropdown';

const DAY_LABELS = {
    monday: 'Hétfő',
    tuesday: 'Kedd',
    wednesday: 'Szerda',
    thursday: 'Csütörtök',
    friday: 'Péntek',
    saturday: 'Szombat',
};

export default function TimetableEntryModal({ classId, day, entry, onClose, onSave, onDelete }) {
    const isEditMode = Boolean(entry);

    const { data: subjectsData } = useSubjectsForDropdown();
    const { data: teachersData } = useTeachersForDropdown();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode) {
            reset({
                subject_id: entry.subject?.id ?? '',
                teacher_id: entry.teacher?.id ?? '',
                start_time: entry.start_time ?? '',
                end_time: entry.end_time ?? '',
                room: entry.room ?? '',
            });
        } else {
            reset({
                subject_id: '',
                teacher_id: '',
                start_time: '',
                end_time: '',
                room: '',
            });
        }
    }, [isEditMode, entry, reset]);

    function onSubmit(data) {
        onSave({
            ...data,
            class_id: Number(classId),
            day,
            teacher_id: data.teacher_id || null,
        });
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
                            {isEditMode ? 'Óra szerkesztése' : 'Új óra hozzáadása'} – {DAY_LABELS[day]}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tantárgy</label>
                                <select
                                    className={`form-select ${errors.subject_id ? 'is-invalid' : ''}`}
                                    {...register('subject_id', {
                                        required: 'A tantárgy kiválasztása kötelező.',
                                    })}
                                >
                                    <option value="">Válassz...</option>
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

                            <div className="mb-3">
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

                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Kezdés</label>
                                    <input
                                        type="time"
                                        className={`form-control ${errors.start_time ? 'is-invalid' : ''}`}
                                        {...register('start_time', {
                                            required: 'A kezdési idő kötelező.',
                                        })}
                                    />
                                    {errors.start_time && (
                                        <div className="invalid-feedback">{errors.start_time.message}</div>
                                    )}
                                </div>

                                <div className="col-6 mb-3">
                                    <label className="form-label">Befejezés</label>
                                    <input
                                        type="time"
                                        className={`form-control ${errors.end_time ? 'is-invalid' : ''}`}
                                        {...register('end_time', {
                                            required: 'A befejezési idő kötelező.',
                                        })}
                                    />
                                    {errors.end_time && (
                                        <div className="invalid-feedback">{errors.end_time.message}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Terem</label>
                                <input className="form-control" {...register('room')} />
                            </div>
                        </div>

                        <div className="modal-footer d-flex justify-content-between">
                            <div>
                                {isEditMode && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => onDelete(entry.id)}
                                    >
                                        Törlés
                                    </button>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                >
                                    Mégse
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Mentés
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}