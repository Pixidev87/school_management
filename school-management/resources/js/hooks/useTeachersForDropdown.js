import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useTeachersForDropdown() {
    return useQuery({
        queryKey: ["teachers", "all"],
        queryFn: () =>
            api
                .get("/teachers", { params: { per_page: 100 } })
                .then((res) => res.data),
    });
}
