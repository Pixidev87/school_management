import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function onSubmit(data) {
        setServerError(null);
        setIsSubmitting(true);

        try {
            await login(data.email, data.password);
            navigate("/dashboard");
        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                    "Hiba történt bejelentkezés során..",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h1 className="h3 mb-4 text-center">
                                {" "}
                                Bejelentkezés{" "}
                            </h1>

                            {serverError && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email cím
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        {...register("email", {
                                            required:
                                                "Az email cim megadása kötelező",
                                        })}
                                    />

                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Jelszó
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        {...register("password", {
                                            required:
                                                "A jelszó megadása kötelező.",
                                        })}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Bejelentkezés..."
                                        : "Bejelentkezés"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
