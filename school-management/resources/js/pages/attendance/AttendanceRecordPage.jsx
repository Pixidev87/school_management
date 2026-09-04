import { useEffect, useState } from 'react';
import { useClasses } from '../../hooks/useClasses';
import {
    useClassStudents,
    useClassAttendance,
    useRecordStudentAttendance,
} from '../../hooks/useAttendance';


const STATUS_OPTIONS = [
    { value: 'present', label: 'Jelen van' },
    { value: 'absent', label: 'Hiányzik' },
    { value: 'late', label: 'Késett' },
    { value: 'excused', label: 'Igazolt' },
];


function today() {
    return new Date().toISOString().split('T')[0];
}

export default function AttendanceRecordPage() {
    const [classId, setClassId] = useState('');
    const [date, setDate] = useState(today());

    const [attendanceMap, setAttendanceMap] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

    const { data: classesData } = useClasses();
    const { data: students, isLoading: studentsLoading } = useClassStudents(classId);
    const { data: existingAttendance } = useClassAttendance(classId, date);
    const recordAttendance = useRecordStudentAttendance();


    useEffect(() => {
        if (!students) return;

        const map = {};

        students.forEach((student) => {
            const existing = existingAttendance?.find(
                (a) => a.student?.id === student.id
            );

            map[student.id] = {
                status: existing?.status ?? 'present',
                note: existing?.note ?? '',
            };
        });

        setAttendanceMap(map);
    }, [students, existingAttendance]);

    function updateStatus(studentId, status) {
        setAttendanceMap((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    }

    function updateNote(studentId, note) {
        setAttendanceMap((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], note },
        }));
    }

    async function handleSubmit() {
        setSuccessMessage(null);

        const attendances = Object.entries(attendanceMap).map(
            ([studentId, data]) => ({
                student_id: Number(studentId),
                status: data.status,
                note: data.note || null,
            })
        );

        try {
            await recordAttendance.mutateAsync({
                class_id: Number(classId),
                date,
                attendances,
            });

            setSuccessMessage('A jelenlét sikeresen rögzítve!');
        } catch (error) {
            setSuccessMessage(null);
            alert(
                error.response?.data?.message || 'Hiba történt a mentés során.'
            );
        }
    }

    return (
        <div>
            <h1 className="h3 mb-4">Jelenlét rögzítése</h1>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
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

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Dátum</label>
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            {!classId && (
                <div className="alert alert-info">
                    Válassz osztályt a jelenlét rögzítéséhez.
                </div>
            )}

            {classId && studentsLoading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Betöltés...</span>
                    </div>
                </div>
            )}

            {classId && students && students.length > 0 && (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Törzsszám</th>
                                    <th>Név</th>
                                    <th style={{ width: '220px' }}>Státusz</th>
                                    <th>Megjegyzés</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.roll_number}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={attendanceMap[student.id]?.status ?? 'present'}
                                                onChange={(e) =>
                                                    updateStatus(student.id, e.target.value)
                                                }
                                            >
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Opcionális megjegyzés"
                                                value={attendanceMap[student.id]?.note ?? ''}
                                                onChange={(e) =>
                                                    updateNote(student.id, e.target.value)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={recordAttendance.isPending}
                        >
                            {recordAttendance.isPending ? 'Mentés...' : 'Jelenlét mentése'}
                        </button>
                    </div>
                </div>
            )}

            {classId && students && students.length === 0 && !studentsLoading && (
                <div className="alert alert-warning">
                    Ebben az osztályban még nincs diák.
                </div>
            )}
        </div>
    );
}