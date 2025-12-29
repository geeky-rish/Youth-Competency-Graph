import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ResourceRecommendations = () => {
    const { user } = useSelector((state) => state.auth);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user || !user.targetRoles || user.targetRoles.length === 0) {
                setLoading(false);
                return;
            }

            try {
                // For now, we'll pick the first target role to show recommendations for
                const targetRole = user.targetRoles[0];

                const response = await api.post('/resources/recommend', { role: targetRole });

                setRecommendations(response.data.recommendations || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6 text-red-500">Error</h1>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/dashboard" className="text-gray-400 hover:text-white mb-6 inline-block">
                    &larr; Back to Dashboard
                </Link>

                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                    Learning Path Recommendations
                </h1>
                <p className="text-gray-400 mb-10 text-lg">
                    Curated resources driven by your role goals and skill gaps.
                </p>

                {recommendations.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                        <h2 className="text-xl text-gray-300">No specific recommendations found right now.</h2>
                        <p className="text-gray-500 mt-2">You might be fully up to speed for your current target role!</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl transition-all hover:border-gray-600">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/3 border-r border-gray-700 pr-0 md:pr-8">
                                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                            {rec.skill}
                                        </h2>
                                        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
                                            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">AI Insight</h3>
                                            <p className="text-gray-300 italic whitespace-pre-wrap text-sm leading-relaxed">
                                                {rec.explanation}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:w-2/3">
                                        <h3 className="text-xl font-semibold text-gray-200 mb-4">Recommended Content</h3>
                                        <div className="grid gap-4">
                                            {rec.resources.map((resource, i) => (
                                                <a
                                                    key={i}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-4 bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-850 transition-all group"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-lg font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                                                                {resource.title}
                                                            </h4>
                                                            <p className="text-gray-400 text-sm mt-1 mb-2 max-w-xl">
                                                                {resource.description}
                                                            </p>
                                                            <div className="flex gap-2 mt-2">
                                                                <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize 
                                                                    ${resource.difficulty === 'beginner' ? 'bg-green-900 text-green-300' :
                                                                        resource.difficulty === 'intermediate' ? 'bg-yellow-900 text-yellow-300' :
                                                                            'bg-red-900 text-red-300'}`}>
                                                                    {resource.difficulty}
                                                                </span>
                                                                <span className="text-xs px-2 py-1 rounded-md bg-gray-700 text-gray-300 capitalize">
                                                                    {resource.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-500 group-hover:text-white transition-colors">
                                                            &#8599;
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceRecommendations;
