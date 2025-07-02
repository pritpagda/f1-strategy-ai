import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Timer, Loader2, Zap} from 'lucide-react';
import {PredictionData, defaultPredictionData} from "../utils/types";
import api from '../utils/api';

export interface ModalContent {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | '';
}

interface PredictionFormProps {
    onPredict: (seconds: number) => void;
    onShowModal: (modalData: ModalContent) => void;
    apiBaseUrl?: string;
}

const PredictionForm: React.FC<PredictionFormProps> = ({onPredict, onShowModal}) => {
    const [data, setData] = useState<PredictionData>(defaultPredictionData);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof PredictionData, value: any) => {
        setData(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/predict', data);
            onPredict(response.data.predicted_lap_time_seconds);
            onShowModal({
                title: 'Prediction Successful',
                message: 'Lap time predicted with high accuracy.',
                type: 'success',
            });
        } catch (err: any) {
            console.error('Prediction Error:', err);
            onShowModal({
                title: 'Prediction Failed',
                message: err.message || 'Prediction failed. Please try again.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const inputs = [
        {id: 'compound', type: 'select', label: 'Compound', options: ['Soft', 'Medium', 'Hard']},
        {id: 'stint', type: 'number', label: 'Stint'},
        {id: 'lap_number', type: 'number', label: 'Lap Number'},
        {id: 'tyre_life', type: 'number', label: 'Tyre Life (laps)'},
        {id: 'track_status', type: 'number', label: 'Track Status'},
        {id: 'air_temp', type: 'number', label: 'Air Temp (°C)'},
        {id: 'track_temp', type: 'number', label: 'Track Temp (°C)'},
        {id: 'humidity', type: 'number', label: 'Humidity (%)'},
        {id: 'wind_speed', type: 'number', label: 'Wind Speed (m/s)'},
        {id: 'fresh_tyre', type: 'select', label: 'Fresh Tyre', options: ['Yes', 'No']},
        {id: 'team', type: 'text', label: 'Team'},
        {id: 'driver', type: 'text', label: 'Driver'}
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center text-white gap-2">
                <Zap className="h-5 w-5 text-red-500 animate-pulse"/>
                <span>Prediction Parameters</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputs.map(({id, type, label, options}) => (
                    <div key={id}>
                        <label htmlFor={id} className="block text-gray-300 font-semibold text-sm mb-1">
                            {label} <span className="text-red-400">*</span>
                        </label>

                        {type === 'select' ? (
                            <select
                                id={id}
                                value={
                                    id === 'fresh_tyre'
                                        ? data.fresh_tyre
                                            ? 'Yes'
                                            : 'No'
                                        : (data as any)[id]
                                }
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    handleInputChange(
                                        id as keyof PredictionData,
                                        id === 'fresh_tyre' ? e.target.value === 'Yes' : e.target.value
                                    )
                                }
                                className="w-full p-2 rounded-md bg-gray-900/70 text-white border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                required
                            >
                                <option value="" disabled>Select option</option>
                                {options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={id}
                                type={type}
                                value={
                                    (data as any)[id] === 0 ? '' : (data as any)[id]
                                }
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange(
                                        id as keyof PredictionData,
                                        e.target.value === '' ? '' : type === 'number' ? Number(e.target.value) : e.target.value
                                    )
                                }
                                className="w-full p-2 rounded-md bg-gray-900/70 text-white border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                placeholder={`e.g. ${type === 'number' ? '1' : ''}`}
                                required
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full font-extrabold text-base transition-all
            ${loading
                        ? 'bg-red-900/60 text-red-300 cursor-not-allowed border border-red-900'
                        : 'bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-lg hover:shadow-red-500/40'}`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin"/>
                            Predicting...
                        </>
                    ) : (
                        <>
                            <Timer className="w-5 h-5"/>
                            Predict Lap Time
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default PredictionForm;
