import { useState } from 'react';
import { useClasses } from '../../hooks/useClasses';
import {
    useClassTimetable,
    useCreateTimetable,
    useUpdateTimetable,
    useDeleteTimetable,
} from '../../hooks/useTimetable';
import TimetableEntryModal from '../../components/timetable/TimetableEntryModal';

const DAYS = [
    { key: 'monday', label: 'Hétfő' },
    { key: 'tuesday', label: 'Kedd' },
    { key: 'wednesday', label: 'Szerda' },
    { key: 'thursday', label: 'Csütörtök' },
    { key: 'friday', label: 'Péntek' },
    { key: 'saturday', label: 'Szombat' },
];

export default function TimetablePage() {
    const [classId, setClassId] = useState('');


    const [modalAction, setModalAction] = useState(null);

    const { data: classesData } = useClasses();
    const { data: timetable, isLoading } = useClassTimetable(classId);

    const createTimetable = useCreateTimetable();
    const updateTimetable = useUpdateTimetable(modalAction?.entry?.id);
    const deleteTimetable = useDeleteTimetable();

    const groupedByDay = (timetable ?? []).reduce((acc, entry) => {
        if (!acc[entry.day]) acc[entry.day] = [];
        acc[entry.day].push(entry);
        return acc;
    }, {});

    function openCreateModal(day) {
        setModalAction({ day, entry: null });
    }

    function openEditModal(entry) {
        setModalAction({ day: entry.day, entry });
    }

    function closeModal() {
        setModalAction(null);
    }

    async function handleSave(data) {
        try {
            if (modalAction.entry) {
                await updateTimetable.mutateAsync(data);
            } else {
                await createTimetable.mutateAsync(data);
            }

            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Hiba történt a mentés során.');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Biztosan törlöd ezt az órát?')) {
            return;
        }

        await deleteTimetable.mutateAsync(id);
        closeModal();
    }

    return (
        <div>
            <h1 className="h3 mb-4">Órarend</h1>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <label className="form-label">Osztály</label>
                    <select
                        className="form-select"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                    >
                        <option value="">Válassz osztályt...</option>
                        {classesData?.data.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `- ${cls.section}` : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!classId && (
                <div className="alert alert-info">
                    Válassz osztályt az órarend megtekintéséhez.
                </div>
            )}

            {classId && isLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Betöltés...</span>
                    </div>
                </div>
            )}

            {classId && !isLoading && (
                <div className="row">
                    {DAYS.map((day) => (
                        <div key={day.key} className="col-md-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <strong>{day.label}</strong>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openCreateModal(day.key)}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                                <div className="list-group list-group-flush">
                                    {(groupedByDay[day.key] ?? []).length === 0 && (
                                        <div className="list-group-item text-muted small">
                                            Nincs rögzített óra.
                                        </div>
                                    )}

                                    {(groupedByDay[day.key] ?? []).map((entry) => (
                                        <button
                                            key={entry.id}
                                            className="list-group-item list-group-item-action"
                                            onClick={() => openEditModal(entry)}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <strong>{entry.subject?.name}</strong>
                                                <small className="text-muted">
                                                    {entry.start_time}–{entry.end_time}
                                                </small>
                                            </div>
                                            <small className="text-muted">
                                                {entry.teacher?.name ?? 'Nincs tanár kijelölve'}
                                                {entry.room ? ` · ${entry.room} terem` : ''}
                                            </small>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalAction && (
                <TimetableEntryModal
                    classId={classId}
                    day={modalAction.day}
                    entry={modalAction.entry}
                    onClose={closeModal}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}