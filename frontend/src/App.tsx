import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PredictionPage from './pages/PredictionPage';
import StrategyPage from './pages/StrategyPage';
import TrainingPage from './pages/TrainingPage';


import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    return (
        <Router>
            <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <main className="flex-1 overflow-y-auto p-0 m-0">
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
                            <Route path="/predict" element={<PredictionPage/>}/>
                            <Route path="/strategy" element={<StrategyPage/>}/>
                            <Route path="/train" element={<TrainingPage/>}/>
                            <Route path="*" element={<div className="text-red-500 p-4">404 - Page Not Found</div>}/>
                        </Routes>
                    </ErrorBoundary>
                </main>
            </div>
        </Router>
    );
};

export default App;
