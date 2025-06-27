import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface TrainingFormProps {
  year: number;
  raceName: string;
  isTraining: boolean;
  onChange: (field: 'year' | 'race_name', value: string | number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ year, raceName, isTraining, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4 p-3 rounded-xl">
    <div className="relative">
      <label htmlFor="year" className="block text-gray-300 font-semibold text-sm mb-1">Race Year</label>
      <input
        id="year"
        type="number"
        min={2018}
        max={2024}
        value={year}
        onChange={(e) => onChange('year', parseInt(e.target.value) || 2023)}
        className="w-full p-2 pr-8 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
        required
      />
      <div className="absolute inset-y-0 right-0 top-5 flex items-center pr-2 pointer-events-none">
        <span className="text-gray-500 text-xs font-bold">{year}</span>
      </div>
    </div>
    <div className="relative">
      <label htmlFor="race_name" className="block text-gray-300 font-semibold text-sm mb-1">Race Name</label>
      <input
        id="race_name"
        type="text"
        placeholder="e.g., Bahrain Grand Prix"
        value={raceName}
        onChange={(e) => onChange('race_name', e.target.value)}
        className="w-full p-2 rounded-md bg-gray-900/70 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all duration-300 shadow-inner"
        required
      />
    </div>
    <div className="pt-3">
      <button
        type="submit"
        disabled={isTraining}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full font-extrabold text-sm transition-all duration-300 transform ${isTraining ? 'bg-red-900/60 text-red-300 cursor-not-allowed border border-red-900' : 'bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-lg hover:shadow-red-500/40'}`}
      >
        {isTraining ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Training Model...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Training
          </>
        )}
      </button>
    </div>
  </form>
);

export default TrainingForm;
