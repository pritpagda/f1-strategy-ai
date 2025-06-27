import React from 'react';

export interface FeatureButtonProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

export const FeatureButton: React.FC<FeatureButtonProps> = ({ Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center justify-center p-6 bg-black/40 border border-transparent rounded-2xl transition-all duration-300 hover:border-red-500 hover:bg-red-900/20 shadow-lg"
  >
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-2xl transition-all duration-300 pointer-events-none"></div>
    <div className="text-red-500 mb-4 transition-transform duration-300 group-hover:scale-110">
      <Icon size={48} strokeWidth={1.5} />
    </div>
    <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-center">{description}</p>
  </button>
);

export default FeatureButton;
