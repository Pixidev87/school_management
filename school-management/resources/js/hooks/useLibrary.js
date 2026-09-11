import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useLibraryBooks(page = 1, onlyAvailable = false) {
    return useQuery({
        queryKey: ['library-books', page, onlyAvailable],
        queryFn: () =>
            api
                .get('/library/books', { params: { page, available: onlyAvailable } })
                .then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useLibraryBook(id) {
    return useQuery({
        queryKey: ['library-books', id],
        queryFn: () => api.get(`/library/books/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateLibraryBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/library/books', data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library-books'] });
        },
    });
}

export function useUpdateLibraryBook(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.put(`/library/books/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library-books'] });
        },
    });
}

export function useDeleteLibraryBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/library/books/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library-books'] });
        },
    });
}

export function useIssueBook(bookId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.post(`/library/books/${bookId}/issue`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library-books'] });
            queryClient.invalidateQueries({ queryKey: ['library-issues'] });
        },
    });
}

export function useReturnBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (issueId) =>
            api.post(`/library/issues/${issueId}/return`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library-books'] });
            queryClient.invalidateQueries({ queryKey: ['library-issues'] });
        },
    });
}

export function useActiveIssues(page = 1) {
    return useQuery({
        queryKey: ['library-issues', 'active', page],
        queryFn: () =>
            api.get('/library/issues/active', { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useOverdueIssues(page = 1) {
    return useQuery({
        queryKey: ['library-issues', 'overdue', page],
        queryFn: () =>
            api.get('/library/issues/overdue', { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}