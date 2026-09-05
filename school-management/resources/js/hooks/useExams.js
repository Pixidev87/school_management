import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useExams(page = 1) {
    return useQuery({
        queryKey: ['exams', page],
        queryFn: () => api.get('/exams', { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useExam(id) {
    return useQuery({
        queryKey: ['exams', id],
        queryFn: () => api.get(`/exams/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/exams', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useUpdateExam(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.put(`/exams/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useDeleteExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/exams/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useRecordExamResults(examId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (results) =>
            api.post(`/exams/${examId}/results`, { results }).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

export function useExamStatistics(examId) {
    return useQuery({
        queryKey: ['exams', examId, 'statistics'],
        queryFn: () => api.get(`/exams/${examId}/statistics`).then((res) => res.data.data),
        enabled: !!examId,
    });
}