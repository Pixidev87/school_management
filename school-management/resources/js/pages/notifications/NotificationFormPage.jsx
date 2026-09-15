import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateNotification } from '../../hooks/useNotifications';

const TYPE_OPTIONS = [
    { value: 'notice', label: 'Közlemény' },
    { value: 'announcement', label: 'Hirdetmény' },
    { value: 'reminder', label: 'Emlékeztető' },
    { value: 'alert', label: 'Figyelmeztetés' },
];

const TARGET_OPTIONS = [
    { value: 'all', label: 'Mindenki' },
    { value: 'students', label: 'Diákok' },
    { value: 'teachers', label: 'Tanárok' },
    { value: 'parents', label: 'Szülők' },
];

const CHANNEL_OPTIONS = [
    { value: 'app', label: 'Alkalmazáson belül' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
];

export default function NotificationFormPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const createNotification = useCreateNotification();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            type: 'notice',
            target: 'all',
            channel: 'app',
        },
    });

    async function onSubmit(data) {
        setServerError(null);

        try {
            await createNotification.mutateAsync(data);
            navigate('/notifications');
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setServerError(
                firstError ||
                    error.response?.data?.message ||
                    'Hiba történt az értesítés küldése során.'
            );
        }
    }

    return (
        <div>
            <h1 className="h3 mb-4">Új értesítés küldése</h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && (
                        <div className="alert alert-danger">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Cím</label>
                                <input
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    placeholder="pl. Szülői értekezlet időpontja"
                                    {...register('title', {
                                        required: 'A cím megadása kötelező.',
                                    })}
                                />
                                {errors.title && (
                                    <div className="invalid-feedback">{errors.title.message}</div>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Típus</label>
                                <select className="form-select" {...register('type')}>
                                    {TYPE_OPTIONS.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Célcsoport</label>
                                <select className="form-select" {...register('target')}>
                                    {TARGET_OPTIONS.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Küldési csatorna</label>
                                <select className="form-select" {...register('channel')}>
                                    {CHANNEL_OPTIONS.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Üzenet</label>
                                <textarea
                                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                    rows="5"
                                    placeholder="Az értesítés szövege..."
                                    {...register('message', {
                                        required: 'Az üzenet megadása kötelező.',
                                    })}
                                />
                                {errors.message && (
                                    <div className="invalid-feedback">{errors.message.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={createNotification.isPending}
                            >
                                {createNotification.isPending ? 'Küldés...' : 'Értesítés küldése'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/notifications')}
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
