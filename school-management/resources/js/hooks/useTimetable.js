import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';


export function useClassTimetable(classId) {
    return useQuery({
        queryKey: ['timetables', 'class', classId],
        queryFn: () =>
            api.get(`/timetables/class/${classId}`).then((res) => res.data.data),
        enabled: !!classId,
    });
}

export function useCreateTimetable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/timetables', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timetables'] });
        },
    });
}

export function useUpdateTimetable(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.put(`/timetables/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timetables'] });
        },
    });
}

export function useDeleteTimetable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/timetables/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timetables'] });
        },
    });
}