import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Timer, Loader2, Zap, Plus, BarChart3} from 'lucide-react';
import {CurrentLapData, StintLapData, StrategyData} from '../utils/types';
import api from '../utils/api';

export interface ModalContent {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | '';
}

interface StrategyFormProps {
    onStrategyResult: (result: {
        recommendation: string;
        reasoning: string;
        confidence: string;
    }) => void;
    onShowModal: (modalData: ModalContent) => void;
    apiBaseUrl?: string;
}

const defaultCurrentLapData: CurrentLapData = {
    lap_number: 1,
    compound: '',
    tyre_life: 0,
    lap_pace: 0,
    driver: '',
    stint: 1,
};

const defaultStintLapData: StintLapData = {
    lap: 1,
    compound: '',
    tyre_life: 0,
    lap_pace: 0,
    track_status: 1,
};

const StrategyForm = ({
                          onStrategyResult,
                          onShowModal,
                          apiBaseUrl,
                      }: StrategyFormProps) => {
    const [currentLapData, setCurrentLapData] = useState<CurrentLapData>(
        defaultCurrentLapData
    );
    const [stintHistory, setStintHistory] = useState<StintLapData[]>([
        {...defaultStintLapData, lap: 3},
        {...defaultStintLapData, lap: 2},
        {...defaultStintLapData, lap: 1},
    ]);
    const [raceProgress, setRaceProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCurrentLapChange = (
        field: keyof CurrentLapData,
        value: any
    ) => {
        setCurrentLapData((prev) => ({...prev, [field]: value}));
    };

    const handleStintChange = (
        index: number,
        field: keyof StintLapData,
        value: any
    ) => {
        setStintHistory((prev) => {
            const updated = [...prev];
            updated[index] = {...updated[index], [field]: value};
            return updated;
        });
    };

    const addStintLap = () => {
        setStintHistory((prev) => {
            const maxLap = prev.reduce((max, lap) => Math.max(max, lap.lap), 0);
            return [...prev, {...defaultStintLapData, lap: maxLap + 1}];
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !currentLapData.compound ||
            !currentLapData.driver ||
            raceProgress < 0 ||
            raceProgress > 1
        ) {
            onShowModal({
                title: 'Validation Error',
                message:
                    'Please fill all required fields correctly (Compound, Driver, Race Progress 0-1).',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const payload: StrategyData = {
                current_lap_data: currentLapData,
                stint_history: stintHistory.filter(
                    (sh) => sh.compound && sh.lap > 0
                ),
                race_progress: raceProgress,
            };

            const response = await api.post('/api/strategy', payload);
            const {recommendation, reasoning, confidence} = response.data;

            if (recommendation && reasoning && confidence) {
                onStrategyResult({recommendation, reasoning, confidence});
                onShowModal({
                    title: 'Strategy Recommended',
                    message: 'Received strategy recommendation successfully.',
                    type: 'success',
                });
            } else {
                throw new Error('Invalid response from server. Missing recommendation data.');
            }
        } catch (err: any) {
            console.error('API Error:', err);
            onShowModal({
                title: 'Strategy Request Failed',
                message:
                    err.message ||
                    'Could not get strategy recommendation. Please check inputs and server.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-3 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center space-x-2 text-white">
                <Zap className="h-5 w-5 text-red-500 animate-pulse"/>
                <span>Strategy Input</span>
            </h2>

            <section className="bg-black/40 p-4 rounded-lg shadow-md border border-gray-800">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    <Timer className="h-5 w-5"/> Current Lap Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="current_lap_number" className="block text-gray-300 font-semibold text-sm mb-1">
                            Lap Number <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="current_lap_number"
                            type="number"
                            min={1}
                            required
                            placeholder="e.g. 15"
                            onChange={(e) => handleCurrentLapChange('lap_number', Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        />
                    </div>
                    <div>
                        <label htmlFor="current_compound" className="block text-gray-300 font-semibold text-sm mb-1">
                            Compound <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="current_compound"
                            required
                            defaultValue=""
                            onChange={(e) => handleCurrentLapChange('compound', e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner appearance-none"
                        >
                            <option value="" disabled>Select compound</option>
                            <option value="Soft">Soft</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="current_tyre_life" className="block text-gray-300 font-semibold text-sm mb-1">
                            Tyre Life (laps) <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="current_tyre_life"
                            type="number"
                            min={0}
                            required
                            placeholder="e.g. 12"
                            onChange={(e) => handleCurrentLapChange('tyre_life', Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        />
                    </div>
                    <div>
                        <label htmlFor="current_lap_pace" className="block text-gray-300 font-semibold text-sm mb-1">
                            Lap Pace (seconds) <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="current_lap_pace"
                            type="number"
                            step="0.01"
                            min={0}
                            required
                            placeholder="e.g. 92.5"
                            onChange={(e) => handleCurrentLapChange('lap_pace', Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        />
                    </div>
                    <div>
                        <label htmlFor="current_driver" className="block text-gray-300 font-semibold text-sm mb-1">
                            Driver <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="current_driver"
                            type="text"
                            required
                            placeholder="e.g. Verstappen"
                            onChange={(e) => handleCurrentLapChange('driver', e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        />
                    </div>
                    <div>
                        <label htmlFor="current_stint" className="block text-gray-300 font-semibold text-sm mb-1">
                            Stint <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="current_stint"
                            type="number"
                            min={1}
                            required
                            placeholder="e.g. 2"
                            onChange={(e) => handleCurrentLapChange('stint', Number(e.target.value))}
                            className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-black/40 p-4 rounded-lg shadow-md border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                        <Zap className="h-5 w-5"/> Stint History (Last laps)
                    </h3>
                    <button
                        type="button"
                        onClick={addStintLap}
                        className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-black"
                        aria-label="Add Lap"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Lap
                    </button>
                </div>
                {stintHistory.length === 0 && (
                    <p className="text-gray-400 italic text-center text-sm">No stint laps added yet. Click "Add Lap" to
                        begin.</p>
                )}
                {stintHistory.map((stint, idx) => (
                    <div
                        key={idx}
                        className="mb-3 grid grid-cols-1 md:grid-cols-5 gap-3 bg-black/30 p-3 rounded-md border border-gray-700 last:mb-0 transform transition-transform duration-300 hover:scale-[1.005] hover:border-red-600"
                    >
                        <div>
                            <label htmlFor={`stint_lap-${idx}`}
                                   className="block text-gray-300 font-semibold text-xs mb-1">
                                Lap # <span className="text-red-400">*</span>
                            </label>
                            <input
                                id={`stint_lap-${idx}`}
                                type="number"
                                min={1}
                                required
                                placeholder="e.g. 14"
                                value={stint.lap === 0 ? '' : stint.lap}
                                onChange={(e) => handleStintChange(idx, 'lap', Number(e.target.value))}
                                className="w-full p-1.5 rounded-sm bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor={`stint_compound-${idx}`}
                                   className="block text-gray-300 font-semibold text-xs mb-1">
                                Compound <span className="text-red-400">*</span>
                            </label>
                            <select
                                id={`stint_compound-${idx}`}
                                required
                                value={stint.compound}
                                onChange={(e) => handleStintChange(idx, 'compound', e.target.value)}
                                className="w-full p-1.5 rounded-sm bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner appearance-none text-sm"
                            >
                                <option value="" disabled>Select compound</option>
                                <option value="Soft">Soft</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`stint_tyre_life-${idx}`}
                                   className="block text-gray-300 font-semibold text-xs mb-1">
                                Tyre Life <span className="text-red-400">*</span>
                            </label>
                            <input
                                id={`stint_tyre_life-${idx}`}
                                type="number"
                                min={0}
                                required
                                value={stint.tyre_life === 0 ? '' : stint.tyre_life}
                                placeholder="e.g. 11"
                                onChange={(e) => handleStintChange(idx, 'tyre_life', Number(e.target.value))}
                                className="w-full p-1.5 rounded-sm bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor={`stint_lap_pace-${idx}`}
                                   className="block text-gray-300 font-semibold text-xs mb-1">
                                Lap Pace <span className="text-red-400">*</span>
                            </label>
                            <input
                                id={`stint_lap_pace-${idx}`}
                                type="number"
                                step="0.01"
                                min={0}
                                required
                                value={stint.lap_pace === 0 ? '' : stint.lap_pace}
                                placeholder="e.g. 92.4"
                                onChange={(e) => handleStintChange(idx, 'lap_pace', Number(e.target.value))}
                                className="w-full p-1.5 rounded-sm bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor={`stint_track_status-${idx}`}
                                   className="block text-gray-300 font-semibold text-xs mb-1">
                                Track Status <span className="text-red-400">*</span>
                            </label>
                            <input
                                id={`stint_track_status-${idx}`}
                                type="number"
                                min={0}
                                required
                                value={stint.track_status === 0 ? '' : stint.track_status}
                                placeholder="e.g. 1"
                                onChange={(e) => handleStintChange(idx, 'track_status', Number(e.target.value))}
                                className="w-full p-1.5 rounded-sm bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner text-sm"
                            />
                        </div>
                    </div>
                ))}
            </section>

            <section className="bg-black/40 p-4 rounded-lg shadow-md border border-gray-800">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5"/> Race Progress
                </h3>
                <div>
                    <label htmlFor="race_progress" className="block text-gray-300 font-semibold text-sm mb-1">
                        Race Progress (% race complete) <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="race_progress"
                        type="number"
                        step="0.01"
                        min={0}
                        max={1}
                        required
                        placeholder="e.g 0.5"
                        value={raceProgress === 0 ? '' : raceProgress}
                        onChange={(e) => setRaceProgress(Number(e.target.value))}
                        className="w-full max-w-xs p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
                    />
                </div>
            </section>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full font-extrabold text-base transition-all duration-300 transform
                        ${loading
                        ? 'bg-red-900/60 text-red-300 cursor-not-allowed border border-red-900'
                        : 'bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-lg hover:shadow-red-500/40'
                    } `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin"/>
                            Analyzing Strategy...
                        </>
                    ) : (
                        <>
                            <Timer className="w-5 h-5"/>
                            Submit Strategy
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default StrategyForm;
