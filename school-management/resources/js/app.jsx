import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/app.css";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap-icons/font/bootstrap-icons.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 40 * 1000,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </QueryClientProvider>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
