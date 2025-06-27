// File: src/pages/StrategyPage.tsx
import React, { useState } from 'react';
import { BarChart3, Home, Settings, Zap, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StrategyForm, { ModalContent } from '../components/StrategyForm';
import FeatureButton from '../components/FeatureButton';

interface Toast extends ModalContent {
  id: number;
}
interface StrategyResult {
  recommendation: string;
  reasoning: string;
  confidence: string;
}

const toastColors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-400 text-black',
};

const StrategyPage = () => {
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navigate = useNavigate();

  const addToast = (toast: ModalContent) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // Toast disappears after 4 seconds
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white p-4 overflow-y-auto">
      <div className="container mx-auto max-w-5xl py-6">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-6">
            <BarChart3 className="w-20 h-20 text-red-500 mr-4 animate-pulse" />
            <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-2xl">
              Race Strategy AI
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Harness the power of artificial intelligence to craft winning race strategies. Optimize tire choices, predict pit stop windows, and react dynamically to race conditions.
          </p>
        </div>

        {/* Strategy Form Container */}
        <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-lg border-t-4 border-red-600 rounded-2xl shadow-2xl p-8 transform transition-transform duration-500">
          <h2 className="text-3xl font-bold text-center text-red-400 mb-6">Define Race Parameters</h2>
          <StrategyForm
            onStrategyResult={(result) => setStrategyResult(result)}
            onShowModal={(modalData) => addToast(modalData)}
          />
        </div>

        {/* Display strategy result */}
        {strategyResult && (
          <div className="mt-8 bg-black/60 backdrop-blur-md border border-red-500/40 rounded-2xl p-6 text-white shadow-xl max-w-3xl mx-auto transform transition-transform duration-500 hover:scale-[1.01]">
            <h2 className="text-3xl font-extrabold text-red-400 mb-4 flex items-center justify-center gap-3">
              <Zap className="w-7 h-7 animate-pulse" />
              Optimal Strategy Unveiled
            </h2>

            <div className="space-y-4 text-left">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 font-bold">Recommendation</p>
                <p className="text-xl font-bold text-white leading-snug">{strategyResult.recommendation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 font-bold">Reasoning</p>
                <p className="text-gray-300 text-base leading-relaxed">{strategyResult.reasoning}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 font-bold">Confidence</p>
                <p className="text-white text-lg font-bold">{strategyResult.confidence}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Buttons Section */}
        <div className="mt-12">
          <div className="relative mb-8">
            <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg relative z-10">
              Explore More
            </h2>
            <div className="absolute inset-x-0 top-1/2 h-12 bg-red-800/10 blur-3xl -translate-y-1/2"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureButton
              Icon={Home}
              title="Home"
              description="Return to the main dashboard with all AI racing features."
              onClick={() => navigate('/')}
            />

            <FeatureButton
              Icon={Settings}
              title="Train Model"
              description="Train or refine the AI model with historical race data."
              onClick={() => navigate('/train')}
            />

            <FeatureButton
              Icon={Rocket}
              title="Lap Time Prediction"
              description="Forecast lap times based on specific race parameters."
              onClick={() => navigate('/predict')}
            />
          </div>
        </div>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50 max-w-xs">
          {toasts.map(({ id, title, message, type }) => (
            <div
              key={id}
              className={`relative flex flex-col p-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-out animate-slide-in ${
                toastColors[type as keyof typeof toastColors] || 'bg-gray-800'
              }`}
              role="alert"
            >
              <strong className="font-bold text-base mb-1">{title}</strong>
              <p className="mb-1 text-sm">{message}</p>
              <button
                onClick={() => removeToast(id)}
                className="absolute top-1 right-1 text-white/80 hover:text-white font-bold text-base leading-none transition-colors duration-200"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategyPage;
