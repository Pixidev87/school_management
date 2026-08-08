import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useClasses() {
    return useQuery({
        queryKey: ["classes", "all"],
        queryFn: () =>
            api
                .get("/classes", { params: { per_page: 100 } })
                .then((res) => res.data),
    });
}
