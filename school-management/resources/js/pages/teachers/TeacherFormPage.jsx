import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
    useTeacher,
    useCreateTeacher,
    useUpdateTeacher,
} from "../../hooks/useTeachers";

export default function TeacherFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);

    const { data: teacher, isLoading: teacherLoading } = useTeacher(id);
    const createTeacher = useCreateTeacher();
    const updateTeacher = useUpdateTeacher(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && teacher) {
            reset({
                name: teacher.name,
                email: teacher.email,
                phone: teacher.phone ?? "",
                qualification: teacher.qualification ?? "",
                address: teacher.address ?? "",
                date_of_birth: teacher.date_of_birth ?? "",
                gender: teacher.gender ?? "",
                joining_date: teacher.joining_date ?? "",
            });
        }
    }, [isEditMode, teacher, reset]);

    async function onSubmit(data) {
        setServerError(null);

        try {
            if (isEditMode) {
                await updateTeacher.mutateAsync(data);
            } else {
                await createTeacher.mutateAsync(data);
            }

            navigate("/teachers");
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setServerError(
                firstError ||
                    error.response?.data?.message ||
                    "Hiba történt a mentés során.",
            );
        }
    }

    const isSubmitting = createTeacher.isPending || updateTeacher.isPending;

    if (isEditMode && teacherLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Betöltés...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="h3 mb-4">
                {isEditMode ? "Tanár szerkesztése" : "Új tanár felvétele"}
            </h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Név</label>
                                <input
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    {...register("name", {
                                        required: "A név megadása kötelező.",
                                    })}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    {...register("email", {
                                        required:
                                            "Az email cím megadása kötelező.",
                                    })}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Telefonszám
                                </label>
                                <input
                                    className="form-control"
                                    {...register("phone")}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Végzettség</label>
                                <input
                                    className="form-control"
                                    {...register("qualification")}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Születési dátum
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    {...register("date_of_birth")}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nem</label>
                                <select
                                    className="form-select"
                                    {...register("gender")}
                                >
                                    <option value="">Nincs megadva</option>
                                    <option value="male">Férfi</option>
                                    <option value="female">Nő</option>
                                    <option value="other">Egyéb</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Belépés dátuma
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    {...register("joining_date")}
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Cím</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    {...register("address")}
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Mentés..." : "Mentés"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate("/teachers")}
                            >
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
