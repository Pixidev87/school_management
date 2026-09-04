import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTeachersForDropdown } from "../../hooks/useTeachersForDropdown";
import {
    useSchoolClass,
    useCreateSchoolClass,
    useUpdateSchoolClass,
} from "../../hooks/useSchoolClasses";

export default function SchoolClassFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);

    const { data: teachersData } = useTeachersForDropdown();
    console.log('teachersData: ', teachersData);
    
    const { data: schoolClass, isLoading: classLoading } = useSchoolClass(id);

    const createClass = useCreateSchoolClass();
    const updateClass = useUpdateSchoolClass(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && schoolClass) {
            reset({
                name: schoolClass.name,
                section: schoolClass.section ?? "",
                room_number: schoolClass.room_number ?? "",
                class_teacher_id: schoolClass.class_teacher?.id ?? "",
            });
        }
    }, [isEditMode, schoolClass, reset]);

    async function onSubmit(data) {
        setServerError(null);

        const payload = {
            ...data,
            class_teacher_id: data.class_teacher_id || null,
        };

        try {
            if (isEditMode) {
                await updateClass.mutateAsync(payload);
            } else {
                await createClass.mutateAsync(payload);
            }

            navigate("/classes");
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

    const isSubmitting = createClass.isPending || updateClass.isPending;

    if (isEditMode && classLoading) {
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
                {isEditMode ? "Osztály szerkesztése" : "Új osztály létrehozása"}
            </h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">
                                    Osztály neve
                                </label>
                                <input
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    placeholder="pl. 10A"
                                    {...register("name", {
                                        required: "Az osztály neve kötelező.",
                                    })}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Szekció</label>
                                <input
                                    className="form-control"
                                    {...register("section")}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Terem</label>
                                <input
                                    className="form-control"
                                    {...register("room_number")}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Osztályfőnök
                                </label>
                                <select
                                    className="form-select"
                                    {...register("class_teacher_id")}
                                >
                                    <option value="">Nincs kijelölve</option>
                                    {teachersData?.data.map((teacher) => (
                                        <option
                                            key={teacher.id}
                                            value={teacher.id}
                                        >
                                            {teacher.name}
                                        </option>
                                    ))}
                                </select>
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
                                onClick={() => navigate("/classes")}
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
