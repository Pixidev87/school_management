import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function useStudents(page = 1) {
    return useQuery({
        queryKey: ["students", page],
        queryFn: () =>
            api.get("/students", { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useStudent(id) {
    return useQuery({
        queryKey: ["students", id],
        queryFn: () => api.get(`/students/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.post("/students", data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

export function useUpdateStudent(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.put(`/students/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/students/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}
