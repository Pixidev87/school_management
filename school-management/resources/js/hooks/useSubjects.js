import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useSubjects(page = 1) {
    return useQuery({
        queryKey: ['subjects', page],
        queryFn: () => api.get('/subjects', {params: {page} }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useSubject(id) {
    return useQuery({
        queryKey: ['subjects', id],
        queryFn: () => api.get(`/subjects/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateSubject(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/subjects', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['subjects']});
        },
    });
}

export function useUpdateSubject(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.put(`/subjects/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['subjects']});
        },
    });
}

export function useDeleteSubject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/subjects/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['subjects']});
        },
    });
}

