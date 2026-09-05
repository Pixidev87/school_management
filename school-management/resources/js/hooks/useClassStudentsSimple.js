import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useClassStudentsSimple(classId) {
    return useQuery({
        queryKey: ['classes', classId, 'students'],
        queryFn: () => api.get(`/classes/${classId}/students`).then((res) => res.data.data),
        enabled: !!classId,
    });
}