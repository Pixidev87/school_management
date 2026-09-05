import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam, useRecordExamResults, useExamStatistics } from '../../hooks/useExams';
import { useClassStudentsSimple } from '../../hooks/useClassStudentsSimple';


export default function ExamResultsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resultsMap, setResultsMap] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

    const { data: exam, isLoading: examLoading } = useExam(id);
    const { data: stats } = useExamStatistics(id);
    const recordResults = useRecordExamResults(id);

    const { data: students = [], isLoading: studentsLoading } = useClassStudentsSimple(
        exam?.school_class?.id
    );

    useEffect(() => {
        if (students.length === 0) return;

        const map = {};

        students.forEach((student) => {
            const existing = exam?.results?.find((r) => r.student?.id === student.id);

            map[student.id] = {
                marks_obtained: existing?.marks_obtained ?? '',
                remarks: existing?.remarks ?? '',
            };
        });

        setResultsMap(map);
    }, [students, exam?.results]);

    function updateMarks(studentId, marks) {
        setResultsMap((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], marks_obtained: marks },
        }));
    }

    function updateRemarks(studentId, remarks) {
        setResultsMap((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks },
        }));
    }

    async function handleSubmit() {
        setSuccessMessage(null);

        const results = Object.entries(resultsMap)
            .filter(([, data]) => data.marks_obtained !== '')
            .map(([studentId, data]) => ({
                student_id: Number(studentId),
                marks_obtained: Number(data.marks_obtained),
                remarks: data.remarks || null,
            }));

        if (results.length === 0) {
            alert('Legalább egy diáknál adj meg pontszámot.');
            return;
        }

        try {
            await recordResults.mutateAsync(results);
            setSuccessMessage('Az eredmények sikeresen rögzítve!');
        } catch (error) {
            alert(error.response?.data?.message || 'Hiba történt a mentés során.');
        }
    }

    if (examLoading || studentsLoading) {
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">{exam?.name} – eredmények</h1>
                    <p className="text-muted mb-0">
                        {exam?.school_class?.name} · {exam?.subject?.name} · Max. {exam?.total_marks} pont
                    </p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/exams')}
                >
                    Vissza
                </button>
            </div>

            {stats && stats.total_students > 0 && (
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm text-center">
                            <div className="card-body">
                                <div className="text-muted small">Átlag</div>
                                <div className="fs-4 fw-bold">{stats.average}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm text-center">
                            <div className="card-body">
                                <div className="text-muted small">Legjobb</div>
                                <div className="fs-4 fw-bold text-success">{stats.highest}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm text-center">
                            <div className="card-body">
                                <div className="text-muted small">Leggyengébb</div>
                                <div className="fs-4 fw-bold text-danger">{stats.lowest}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm text-center">
                            <div className="card-body">
                                <div className="text-muted small">Átmenési arány</div>
                                <div className="fs-4 fw-bold">{stats.pass_rate}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            {students.length === 0 && (
                <div className="alert alert-warning">
                    Ebben az osztályban még nincs diák.
                </div>
            )}

            {students.length > 0 && (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Törzsszám</th>
                                    <th>Név</th>
                                    <th style={{ width: '160px' }}>
                                        Pontszám (max {exam?.total_marks})
                                    </th>
                                    <th>Megjegyzés</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.roll_number}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                max={exam?.total_marks}
                                                className="form-control form-control-sm"
                                                value={resultsMap[student.id]?.marks_obtained ?? ''}
                                                onChange={(e) =>
                                                    updateMarks(student.id, e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Opcionális megjegyzés"
                                                value={resultsMap[student.id]?.remarks ?? ''}
                                                onChange={(e) =>
                                                    updateRemarks(student.id, e.target.value)
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
                            disabled={recordResults.isPending}
                        >
                            {recordResults.isPending ? 'Mentés...' : 'Eredmények mentése'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}