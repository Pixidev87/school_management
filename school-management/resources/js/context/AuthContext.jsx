import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            api.get("/auth/me")
                .then((response) => {
                    setUser(response.data.data);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    async function login(email, password) {
        const response = await api.post("/auth/login", { email, password });

        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        return response.data.user;
    }

    async function logout() {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("token");
            setUser(null);
        }
    }

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isTeacher: user?.role === "teacher",
        isParent: user?.role === "parent",
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
