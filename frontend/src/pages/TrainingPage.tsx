import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Settings, Rocket, BarChart3, Home} from 'lucide-react';
import api from '../utils/api';
import TrainingForm from '../components/TrainingForm';
import {FeatureButton} from '../components/FeatureButton';

const TrainingPage: React.FC = () => {
    const [formData, setFormData] = useState({year: 2023, race_name: 'Bahrain Grand Prix'});
    const [isTraining, setIsTraining] = useState(false);
    const [resultMessage, setResultMessage] = useState<{
        status: 'success' | 'error' | null;
        text: string;
    }>({status: null, text: ''});
    const navigate = useNavigate();

    const updateField = (field: 'year' | 'race_name', value: string | number) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsTraining(true);
        setResultMessage({status: null, text: ''});
        try {
            const response = await api.post('api/train', formData);
            setResultMessage({
                status: response.status === 200 ? 'success' : 'error',
                text: response.status === 200
                    ? '✅ Model trained successfully. You can now proceed to prediction or strategy analysis.'
                    : '❌ Training failed. Please try again or check your input.',
            });
        } catch (error) {
            console.error('Error training model:', error);
            setResultMessage({
                status: 'error',
                text: '❌ Error occurred during training. Check backend connection or inputs.',
            });
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white p-4 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <Settings className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-2xl">
                        AI Model Training Hub
                    </h1>
                    <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                        Prepare the prediction model by training it with historical race data. Select a specific race and year to fine-tune the AI's understanding of track conditions, driver performance, and race dynamics.
                    </p>
                </div>
                <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-lg border-t-4 border-red-600 rounded-2xl shadow-2xl p-6 transform transition-transform duration-500">
                    <h2 className="text-2xl font-bold text-center text-red-400 mb-4">Select Training Data</h2>
                    <TrainingForm
                        year={formData.year}
                        raceName={formData.race_name}
                        isTraining={isTraining}
                        onChange={updateField}
                        onSubmit={handleSubmit}
                    />
                    {resultMessage.status && (
                        <div className={`mt-4 text-center rounded-xl px-4 py-2 font-bold text-sm transition-opacity duration-500 ${resultMessage.status === 'success' ? 'bg-green-700/80 text-white' : 'bg-red-700/80 text-white'} opacity-100`}>
                            {resultMessage.text}
                        </div>
                    )}
                </div>
                <div className="mt-12">
                    <div className="relative mb-8">
                        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg relative z-10">
                            Your Next Move
                        </h2>
                        <div className="absolute inset-x-0 top-1/2 h-12 bg-red-800/10 blur-3xl -translate-y-1/2"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <FeatureButton Icon={Home} title="Home" description="Return to the main dashboard with all AI racing features." onClick={() => navigate('/')}/>
                        <FeatureButton Icon={Rocket} title="Predict" description="Forecast lap times, pit stop windows, and race outcomes with high accuracy." onClick={() => navigate('/predict')}/>
                        <FeatureButton Icon={BarChart3} title="Analyze" description="Dive into advanced AI-driven race strategy analysis and simulations." onClick={() => navigate('/strategy')}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;