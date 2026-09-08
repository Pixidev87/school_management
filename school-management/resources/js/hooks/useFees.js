import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useFees(page = 1) {
    return useQuery({
        queryKey: ['fees', page],
        queryFn: () => api.get('/fees', { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useFee(id) {
    return useQuery({
        queryKey: ['fees', id],
        queryFn: () => api.get(`/fees/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useOverdueFees() {
    return useQuery({
        queryKey: ['fees', 'overdue'],
        queryFn: () => api.get('/fees/overdue/list').then((res) => res.data),
    });
}

export function useStudentFees(studentId) {
    return useQuery({
        queryKey: ['fees', 'student', studentId],
        queryFn: () => api.get(`/fees/student/${studentId}`).then((res) => res.data.data),
        enabled: !!studentId,
    });
}

export function useCreateFee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/fees', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
        },
    });
}

export function useUpdateFee(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.put(`/fees/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
        },
    });
}

export function useDeleteFee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/fees/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
        },
    });
}

export function useMarkFeeAsPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.post(`/fees/${id}/pay`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
        },
    });
}