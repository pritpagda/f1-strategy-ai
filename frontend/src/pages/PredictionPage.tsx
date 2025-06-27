// File: src/pages/PredictionPage.tsx
import React, { useState } from 'react';
import { Car, BarChart3, Home, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PredictionForm, { ModalContent } from '../components/PredictionForm';
import FeatureButton from '../components/FeatureButton';

interface Toast extends ModalContent {
  id: number;
}

const toastColors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-400 text-black',
};

const PredictionPage = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
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

  // Helper function to format time in minutes:seconds.milliseconds
  const formatTime = (seconds: number | null) => {
    if (seconds === null || isNaN(seconds)) return { display: 'N/A', total: 'N/A' };

    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3).padStart(6, '0');

    const display = `${minutes}:${secs}`;
    const total = `${seconds.toFixed(3)} seconds`;

    return { display, total };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white p-4 overflow-y-auto">
      <div className="container mx-auto max-w-5xl py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Car className="w-16 h-16 text-red-500 mr-4 animate-pulse" />
            <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-2xl">
              F1 Lap Predictor
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Unleash the power of AI to forecast precise lap times. Input key race parameters and witness the predictive capabilities, guiding your team to optimal performance.
          </p>
        </div>

        {/* Prediction Form Container */}
        <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-lg border-t-4 border-red-600 rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 ">
          <h2 className="text-3xl font-bold text-center text-red-400 mb-6">Get Your Prediction</h2>
          <PredictionForm
            onPredict={(value) => setPrediction(value)}
            onShowModal={(modalData) => addToast(modalData)}
          />
        </div>

        {/* Display Prediction Result */}
        {prediction !== null && (() => {
          const { display, total } = formatTime(prediction);
          return (
            <div className="mt-8 bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 text-center text-white text-3xl font-extrabold shadow-lg transition-all duration-500 transform scale-100 hover:scale-[1.01]">
              <span className="block mb-1 text-red-400 text-lg font-semibold">Predicted Lap Time:</span>
              <span className="text-white">{display}</span>
              <span className="text-base text-gray-400 ml-3 font-normal">({total})</span>
              <p className="mt-3 text-gray-300 text-sm">
                This prediction offers a highly accurate estimate based on current model parameters.
              </p>
            </div>
          );
        })()}

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
              Icon={BarChart3}
              title="Strategy Analysis"
              description="Get AI-powered strategy recommendations based on current race conditions and historical data."
              onClick={() => navigate('/strategy')}
            />
            <FeatureButton
              Icon={Settings}
              title="Train Model"
              description="Go back to train the AI model with new or updated race data."
              onClick={() => navigate('/train')}
            />
          </div>
        </div>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50 max-w-xs">
          {toasts.map(({ id, title, message, type }) => (
            <div
              key={id}
              className={`relative flex flex-col p-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-out animate-slide-in ${toastColors[type as keyof typeof toastColors] || 'bg-gray-800'}`}
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

export default PredictionPage;
