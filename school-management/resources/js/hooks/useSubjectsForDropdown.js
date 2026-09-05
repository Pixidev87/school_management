import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useSubjectsForDropdown() {
    return useQuery({
        queryKey: ['subjects', 'all'],
        queryFn: () => api.get('/subjects', { params: { per_page: 100 } }).then((res) => res.data),
    });
}