import React from 'react';
import { Car, Clock, BarChart3, Settings, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'; // Assuming Button is a separate, already styled component

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Clock,
            title: "Lap Time Prediction",
            description: "Predict lap times based on tire compound, track conditions, and weather.",
            detail: "Our neural network analyzes 10+ variables including weather patterns, tire degradation curves, and lap Number to deliver predictions within 0.1 seconds of actual lap times.",
            route: '/predict'
        },
        {
            icon: BarChart3,
            title: "Strategy Analysis",
            description: "Get AI-powered strategy recommendations based on current race conditions and historical data.",
            detail: "From pit window optimization to tire compound selection, our AI processes millions of race scenarios to suggest championship-winning strategies.",
            route: '/strategy'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 relative overflow-hidden font-inter p-4">
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 opacity-20 z-0">
                <div className="absolute top-8 left-1/4 w-80 h-80 bg-red-500/30 rounded-full blur-3xl"/>
                <div className="absolute bottom-8 right-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"/>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-400/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"/>
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-6xl py-10">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center items-center mb-6 group">
                        <div className="relative p-1.5">
                            <Car
                                className="w-16 h-16 text-red-400 mr-4 group-hover:scale-110 transition-transform duration-300 transform-gpu"/>
                            <div
                                className="absolute -inset-2.5 bg-red-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        </div>
                        <div>
                            <h1 className="text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight drop-shadow-lg">
                                F1 Strategy AI
                            </h1>
                            <div
                                className="h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-3 rounded-full shadow-lg w-40"/>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mb-16">
                    <div
                        className="bg-black/50 backdrop-blur-xl border border-red-500/40 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl hover:border-red-400/60 transition-all duration-500 group relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                        <div className="relative z-10">
                            <Zap className="w-10 h-10 text-orange-400 mx-auto mb-4"/>
                            <h2 className="text-3xl font-extrabold text-white mb-4">
                                Ready to <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Dominate the Grid</span>?
                            </h2>
                            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                                Jump straight into the action with our powerful pre-trained models,
                                or unleash your potential by training custom AI for unique insights.
                                Your championship strategy starts here.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    icon={Settings}
                                    onClick={() => navigate('/train')}
                                    className="bg-red-600 hover:bg-red-700 px-6 py-2 text-base font-bold rounded-full shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                                >
                                    Train Custom Model
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-16">
                    <h3 className="text-4xl font-extrabold text-center text-white mb-10 drop-shadow-lg">
                        Unlock Key Advantages
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="group">
                                <div
                                    className="bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 h-full hover:border-red-400/50 hover:bg-black/60 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden shadow-xl"
                                    onClick={() => navigate(feature.route)}>

                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                                    <div className="relative z-10">
                                        <div className="flex items-center mb-4">
                                            <div
                                                className="bg-red-500/20 p-3 rounded-xl mr-3 group-hover:bg-red-500/30 transition-colors duration-300 shadow-inner">
                                                <feature.icon
                                                    className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform duration-300"/>
                                            </div>
                                            <h4 className="text-xl font-bold text-white leading-snug">{feature.title}</h4>
                                        </div>

                                        <p className="text-gray-300 text-base leading-relaxed mb-3">
                                            {feature.description}
                                        </p>

                                        <p className="text-gray-400 text-sm mb-4 leading-relaxed italic border-l-4 border-red-600 pl-3">
                                            {feature.detail}
                                        </p>

                                        <div
                                            className="flex items-center text-red-400 font-semibold text-sm group-hover:text-red-300 transition-colors">
                                            <span>Explore Feature</span>
                                            <ChevronRight
                                                className="w-4 h-4 ml-1.5 group-hover:translate-x-2 transition-transform duration-300"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-10 border-t border-gray-700/50">
                    <p className="text-base text-gray-400 mb-3">
                        Ready to elevate your F1 strategy?
                    </p>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;
