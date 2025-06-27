// File: src/components/PredictionForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Timer, Loader2, Zap } from 'lucide-react';
// Assuming PredictionData and defaultPredictionData are defined in ../utils/types
// Assuming api is an axios instance or similar utility in ../utils/api
import { PredictionData, defaultPredictionData } from "../utils/types";
import api from '../utils/api';

// Interface for modal content, used for toast notifications
export interface ModalContent {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | '';
}

// Props for the PredictionForm component
interface PredictionFormProps {
    onPredict: (seconds: number) => void; // Callback to pass the predicted lap time to parent
    onShowModal: (modalData: ModalContent) => void; // Callback to show a modal/toast notification
    apiBaseUrl?: string; // Optional API base URL, though not directly used in the fetch call logic here
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, onShowModal, apiBaseUrl }) => {
    // State to store the form data, initialized with default values
    const [data, setData] = useState<PredictionData>(defaultPredictionData);
    // State to manage the loading status during API calls
    const [loading, setLoading] = useState(false);

    // Handler for input changes, updating the form data state
    const handleInputChange = (field: keyof PredictionData, value: any) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handler for form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        setLoading(true); // Set loading to true
        try {
            // Make an API call to the prediction endpoint with the form data
            const response = await api.post('/api/predict', data);
            const responseData = response.data; // Get the response data

            // Call onPredict with the predicted lap time
            onPredict(responseData.predicted_lap_time_seconds);
            // Show a success toast notification
            onShowModal({
                title: 'Prediction Successful',
                message: 'Lap time predicted with high accuracy.',
                type: 'success',
            });
        } catch (err: any) {
            // Handle any errors during the API call
            console.error('Prediction API Error:', err); // Log the error for debugging
            // Show an error toast notification
            onShowModal({
                title: 'Prediction Failed',
                message: err.message || 'Could not get prediction. Please check your inputs and try again.',
                type: 'error',
            });
        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center space-x-2 text-white">
                <Zap className="h-5 w-5 text-red-500 animate-pulse" />
                <span>Prediction Parameters</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Compound Selection */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="compound">
                        Compound <span className="text-red-400">*</span>
                    </label>
                    <select
                        id="compound"
                        value={data.compound}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('compound', e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner appearance-none"
                        required
                    >
                        <option value="" disabled>Select compound</option>
                        <option value="Soft">Soft</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                {/* Stint Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="stint">
                        Stint <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="stint"
                        type="number"
                        value={data.stint === 0 ? '' : data.stint} // Display empty string if 0 for better UX
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('stint', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        min={1}
                        placeholder="e.g. 1"
                        required
                    />
                </div>

                {/* Lap Number Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="lap_number">
                        Lap Number <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="lap_number"
                        type="number"
                        value={data.lap_number === 0 ? '' : data.lap_number}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('lap_number', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        min={1}
                        placeholder="e.g. 15"
                        required
                    />
                </div>

                {/* Tyre Life Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="tyre_life">
                        Tyre Life (laps) <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="tyre_life"
                        type="number"
                        value={data.tyre_life === 0 ? '' : data.tyre_life}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('tyre_life', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        min={1}
                        placeholder="e.g. 5"
                        required
                    />
                </div>

                {/* Track Status Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="track_status">
                        Track Status <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="track_status"
                        type="number"
                        value={data.track_status === 0 ? '' : data.track_status}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('track_status', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        min={1}
                        placeholder="e.g. 1"
                        required
                    />
                </div>

                {/* Air Temperature Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="air_temp">
                        Air Temperature (°C) <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="air_temp"
                        type="number"
                        value={data.air_temp === 0 ? '' : data.air_temp}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('air_temp', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        placeholder="e.g. 25"
                        required
                    />
                </div>

                {/* Track Temperature Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="track_temp">
                        Track Temperature (°C) <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="track_temp"
                        type="number"
                        value={data.track_temp === 0 ? '' : data.track_temp}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('track_temp', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        placeholder="e.g. 32"
                        required
                    />
                </div>

                {/* Humidity Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="humidity">
                        Humidity (%) <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="humidity"
                        type="number"
                        value={data.humidity === 0 ? '' : data.humidity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('humidity', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        min={0}
                        max={100}
                        placeholder="e.g. 45"
                        required
                    />
                </div>

                {/* Wind Speed Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="wind_speed">
                        Wind Speed (m/s) <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="wind_speed"
                        type="number"
                        value={data.wind_speed === 0 ? '' : data.wind_speed}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('wind_speed', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        min={0}
                        placeholder="e.g. 3"
                        required
                    />
                </div>

                {/* Fresh Tyre Selection */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="fresh_tyre">
                        Fresh Tyre <span className="text-red-400">*</span>
                    </label>
                    <select
                        id="fresh_tyre"
                        value={data.fresh_tyre ? "true" : "false"}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('fresh_tyre', e.target.value === "true")}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner appearance-none"
                        required
                    >
                        <option value="" disabled>Select option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                {/* Team Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="team">
                        Team <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="team"
                        type="text"
                        value={data.team}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('team', e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        placeholder="e.g. Red Bull"
                        required
                    />
                </div>

                {/* Driver Input */}
                <div>
                    <label className="block text-gray-300 font-semibold text-sm mb-1" htmlFor="driver">
                        Driver <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="driver"
                        type="text"
                        value={data.driver}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('driver', e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        placeholder="e.g. Verstappen"
                        required
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full font-extrabold text-base transition-all duration-300 transform
                        ${loading
                            ? 'bg-red-900/60 text-red-300 cursor-not-allowed border border-red-900'
                            : 'bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-lg hover:shadow-red-500/40'
                        } `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Predicting...
                        </>
                    ) : (
                        <>
                            <Timer className="w-5 h-5" />
                            Predict Lap Time
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default PredictionForm;
