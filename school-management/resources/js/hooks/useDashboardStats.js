import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const [students, teachers, classes, overdueFees] =
                await Promise.all([
                    api.get("/students", { params: { per_page: 1 } }),
                    api.get("/teachers", { params: { per_page: 1 } }),
                    api.get("/classes", { params: { per_page: 1 } }),
                    api.get("/fees/overdue/list", { params: { per_page: 1 } }),
                ]);

            return {
                studentsCount: students.data.meta?.total ?? 0,
                teachersCount: teachers.data.meta?.total ?? 0,
                classesCount: classes.data.meta?.total ?? 0,
                overdueFeesCount: overdueFees.data.meta?.total ?? 0,
            };
        },
    });
}
