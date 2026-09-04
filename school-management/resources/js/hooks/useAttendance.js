import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

/**
 * Egy osztály diákjainak jelenléte egy adott napon.
 */
export function useClassAttendance(classId, date) {
    return useQuery({
        queryKey: ['attendances', 'class', classId, date],
        queryFn: () =>
            api
                .get(`/attendances/class/${classId}`, { params: { date } })
                .then((res) => res.data.data),
        enabled: !!(classId && date),
    });
}

/**
 * Egy osztály diákjainak listája - a jelenléti táblázat soraihoz kell.
 */
export function useClassStudents(classId) {
    return useQuery({
        queryKey: ['classes', classId, 'students'],
        queryFn: () =>
            api.get(`/classes/${classId}/students`).then((res) => res.data.data),
        enabled: !!classId,
    });
}

/**
 * Diák jelenlétének tömeges rögzítése.
 */
export function useRecordStudentAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) =>
            api.post('/attendances/students', payload).then((res) => res.data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['attendances'] });
        },
    });
}

/**
 * Egy diák jelenléti statisztikája.
 */
export function useStudentAttendanceStats(studentId, from, to) {
    return useQuery({
        queryKey: ['attendances', 'student', studentId, from, to],
        queryFn: () =>
            api
                .get(`/attendances/student/${studentId}`, { params: { from, to } })
                .then((res) => res.data.data),
        enabled: !!studentId,
    });
}