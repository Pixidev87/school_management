import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useTransports(page = 1) {
    return useQuery({
        queryKey: ['transports', page],
        queryFn: () =>
            api.get('/transports', { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useTransport(id) {
    return useQuery({
        queryKey: ['transports', id],
        queryFn: () => api.get(`/transports/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateTransport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/transports', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
        },
    });
}

export function useUpdateTransport(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.put(`/transports/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
        },
    });
}

export function useDeleteTransport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/transports/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
        },
    });
}

export function useAssignStudent(transportId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.post(`/transports/${transportId}/assign`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
        },
    });
}

export function useRemoveStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ transportId, studentId }) =>
            api.delete(`/transports/${transportId}/remove/${studentId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transports'] });
        },
    });
}
