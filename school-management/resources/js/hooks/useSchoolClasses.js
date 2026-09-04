import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function useSchoolClasses(page = 1) {
    return useQuery({
        queryKey: ["classes", page],
        queryFn: () =>
            api.get("/classes", { params: { page } }).then((res) => res.data),
        keepPreviousData: true,
    });
}

export function useSchoolClass(id) {
    return useQuery({
        queryKey: ["classes", id],
        queryFn: () => api.get(`/classes/${id}`).then((res) => res.data.data),
        enabled: !!id,
    });
}

export function useCreateSchoolClass() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.post("/classes", data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
}

export function useUpdateSchoolClass(id) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) =>
            api.put(`/classes/${id}`, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
}

export function useDeleteSchoolClass() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/classes/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
}
