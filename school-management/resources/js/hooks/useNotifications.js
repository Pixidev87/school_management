import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useNotifications(page = 1) {
    return useQuery({
        queryKey: ['notifications', page],
        queryFn: () =>
            api.get('/notifications', { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useNotification(id) {
    return useQuery({
        queryKey: ['notifications', id],
        queryFn: () => api.get(`/notifications/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}


export function useMyNotifications() {
    return useQuery({
        queryKey: ['notifications', 'my'],
        queryFn: () =>
            api.get('/notifications/meta/user').then((res) => res.data.data),
    });
}

export function useUnreadCount() {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: () =>
            api.get('/notifications/meta/unread-count').then((res) => res.data.data),
        refetchInterval: 60 * 1000,
    });
}

export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/notifications', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/notifications/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}


export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            api.post(`/notifications/${id}/read`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}
