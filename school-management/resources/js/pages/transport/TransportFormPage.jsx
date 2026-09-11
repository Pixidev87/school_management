import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateTransport,
    useTransport,
    useUpdateTransport,
} from '../../hooks/useTransport';

function emptyStop(order = 1) {
    return {
        stop_name: '',
        pickup_time: '',
        drop_time: '',
        order,
    };
}

export default function TransportFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState(null);
    const [stops, setStops] = useState([emptyStop()]);

    const { data: transport, isLoading: transportLoading } = useTransport(id);
    const createTransport = useCreateTransport();
    const updateTransport = useUpdateTransport(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && transport) {
            reset({
                route_name: transport.route_name,
                vehicle_number: transport.vehicle_number,
                driver_name: transport.driver_name,
                driver_phone: transport.driver_phone,
                capacity: transport.capacity,
            });

            setStops(
                transport.stops?.length
                    ? transport.stops.map((stop) => ({
                          id: stop.id,
                          stop_name: stop.stop_name ?? '',
                          pickup_time: stop.pickup_time ?? '',
                          drop_time: stop.drop_time ?? '',
                          order: stop.order,
                      }))
                    : [emptyStop()]
            );
        }
    }, [isEditMode, transport, reset]);

    function updateStop(index, field, value) {
        setStops((current) =>
            current.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop))
        );
    }

    function addStop() {
        setStops((current) => [...current, emptyStop(current.length + 1)]);
    }

    function removeStop(index) {
        setStops((current) =>
            current.length === 1
                ? current
                : current.filter((_, i) => i !== index).map((stop, i) => ({ ...stop, order: i + 1 }))
        );
    }

    async function onSubmit(data) {
        setServerError(null);

        const payload = {
            ...data,
            capacity: Number(data.capacity),
            stops: stops
                .filter((stop) => stop.stop_name.trim() !== '')
                .map((stop, index) => ({
                    ...(stop.id ? { id: stop.id } : {}),
                    stop_name: stop.stop_name,
                    pickup_time: stop.pickup_time || null,
                    drop_time: stop.drop_time || null,
                    order: index + 1,
                })),
        };

        try {
            if (isEditMode) {
                await updateTransport.mutateAsync(payload);
            } else {
                await createTransport.mutateAsync(payload);
            }

            navigate('/transports');
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setServerError(
                firstError || error.response?.data?.message || 'Hiba történt a mentés során.'
            );
        }
    }

    const isSubmitting = createTransport.isPending || updateTransport.isPending;

    if (isEditMode && transportLoading) {
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
            <h1 className="h3 mb-4">{isEditMode ? 'Járat szerkesztése' : 'Új járat'}</h1>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    {serverError && <div className="alert alert-danger">{serverError}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Útvonal neve</label>
                                <input
                                    className={`form-control ${errors.route_name ? 'is-invalid' : ''}`}
                                    {...register('route_name', {
                                        required: 'Az útvonal neve kötelező.',
                                    })}
                                />
                                {errors.route_name && (
                                    <div className="invalid-feedback">{errors.route_name.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Rendszám</label>
                                <input
                                    className={`form-control ${
                                        errors.vehicle_number ? 'is-invalid' : ''
                                    }`}
                                    {...register('vehicle_number', {
                                        required: 'A rendszám megadása kötelező.',
                                    })}
                                />
                                {errors.vehicle_number && (
                                    <div className="invalid-feedback">
                                        {errors.vehicle_number.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Sofőr neve</label>
                                <input
                                    className={`form-control ${errors.driver_name ? 'is-invalid' : ''}`}
                                    {...register('driver_name', {
                                        required: 'A sofőr neve kötelező.',
                                    })}
                                />
                                {errors.driver_name && (
                                    <div className="invalid-feedback">{errors.driver_name.message}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Sofőr telefonszáma</label>
                                <input
                                    className={`form-control ${
                                        errors.driver_phone ? 'is-invalid' : ''
                                    }`}
                                    {...register('driver_phone', {
                                        required: 'A telefonszám megadása kötelező.',
                                    })}
                                />
                                {errors.driver_phone && (
                                    <div className="invalid-feedback">
                                        {errors.driver_phone.message}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Férőhely</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                                    {...register('capacity', {
                                        required: 'A férőhely megadása kötelező.',
                                    })}
                                />
                                {errors.capacity && (
                                    <div className="invalid-feedback">{errors.capacity.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h5 mb-0">Megállók</h2>
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addStop}>
                                <i className="bi bi-plus-lg me-1"></i>
                                Megálló
                            </button>
                        </div>

                        {stops.map((stop, index) => (
                            <div className="row g-2 align-items-end mb-2" key={stop.id ?? `new-${index}`}>
                                <div className="col-md-4">
                                    <label className="form-label">Megálló neve</label>
                                    <input
                                        className="form-control"
                                        value={stop.stop_name}
                                        onChange={(e) => updateStop(index, 'stop_name', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Felszállás</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={stop.pickup_time}
                                        onChange={(e) => updateStop(index, 'pickup_time', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Leszállás</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={stop.drop_time}
                                        onChange={(e) => updateStop(index, 'drop_time', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => removeStop(index)}
                                        disabled={stops.length === 1}
                                    >
                                        Törlés
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="d-flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Mentés...' : 'Mentés'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/transports')}
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
