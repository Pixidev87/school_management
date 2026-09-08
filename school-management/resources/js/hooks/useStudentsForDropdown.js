import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useStudentsForDropdown() {
    return useQuery({
        queryKey: ['students', 'all'],
        queryFn: () => api.get('/students', { params: { per_page: 100 } }).then((res) => res.data),
    });
}