import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function useTeachers(page = 1) {
    return useQuery({
        queryKey: ["teachers", page],
        queryFn: () =>
            api.get("/teachers", { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useTeacher(id) {
    return useQuery({
        queryKey: ["teachers", id],
        queryFn: () => api.get(`/teachers/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.post("/teachers", data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
}

export function useUpdateTeacher(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.put(`/teachers/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
}

export function useDeleteTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/teachers/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
}
