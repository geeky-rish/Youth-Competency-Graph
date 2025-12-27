import { useEffect, useState } from 'react';
import api from '../services/api'; // Use centralized API
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, BookOpen, AlertCircle, Award, ArrowRight, Target, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [roleFit, setRoleFit] = useState([]);
    const [nextSkills, setNextSkills] = useState([]);
    const [psychometricAttempt, setPsychometricAttempt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roleFitRes, nextSkillsRes, psychometricRes] = await Promise.all([
                    api.get('/recommendations/role-fit'),
                    api.get('/recommendations/next-skills'),
                    api.get('/psychometric/history').catch(() => ({ data: null }))
                ]);

                setRoleFit(roleFitRes.data);
                setNextSkills(nextSkillsRes.data);
                setPsychometricAttempt(psychometricRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    // Sort roles by highest fit
    const sortedRoles = [...roleFit].sort((a, b) => b.readinessScore - a.readinessScore);

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Welcome Card */}
                <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Hello, {user?.name}!</h2>
                        <p className="opacity-90 max-w-lg mb-6">
                            You are on a great path to achieving your career goals.
                            Check out your latest skill recommendations below.
                        </p>
                        <Link to="/learning" className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-sm">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Continue Learning
                        </Link>
                    </div>
                    {/* Decorative Background Circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-20 w-32 h-32 bg-indigo-300 opacity-20 rounded-full blur-xl"></div>
                </div>

                {/* Resource Recommendations Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-sm border border-gray-700 flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                            <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                            Curated For You
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Resources tailored to your skill gaps and target roles.
                        </p>
                        <Link to="/recommendations" className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition">
                            View Recommendations <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Award className="w-5 h-5 text-indigo-600 mr-2" />
                        Current Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Skills Acquired</span>
                            <span className="text-2xl font-bold text-gray-800">{user?.skills?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Target Roles</span>
                            <span className="text-2xl font-bold text-gray-800">{user?.targetRoles?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Psychometric Assessment Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 shadow-sm border border-indigo-700 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Brain className="w-5 h-5 text-purple-300 mr-2" />
                            Aptitude Profile
                        </h3>

                        {psychometricAttempt ? (
                            <div className="mb-4">
                                <div className="flex items-end mb-1">
                                    <span className="text-3xl font-bold">{psychometricAttempt.totalScore}%</span>
                                    <span className="text-sm text-indigo-300 ml-2 mb-1">Score</span>
                                </div>
                                <p className="text-xs text-indigo-200 line-clamp-2">
                                    {psychometricAttempt.suitabilityInsights?.analytical_strength || "Analysis complete"}
                                </p>
                            </div>
                        ) : (
                            <p className="text-indigo-200 text-sm mb-4">
                                Discover your cognitive strengths and work style.
                            </p>
                        )}

                        <Link
                            to={psychometricAttempt ? "/psychometric-result" : "/psychometric-test"}
                            state={psychometricAttempt ? { result: { score: psychometricAttempt.totalScore, sectionScores: psychometricAttempt.sectionScores, insights: psychometricAttempt.suitabilityInsights } } : {}}
                            className="inline-flex items-center text-purple-300 font-medium hover:text-white transition"
                        >
                            {psychometricAttempt ? "View Insights" : "Start Assessment"}
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-2xl -mr-10 -mb-10"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Role Readiness */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <Target className="w-5 h-5 text-emerald-500 mr-2" />
                        Role Readiness
                    </h3>

                    {sortedRoles.length > 0 ? (
                        <div className="space-y-6">
                            {sortedRoles.map((role) => (
                                <div key={role.roleKey}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{role.roleName}</span>
                                        <span className={`text-sm font-medium ${role.readinessScore >= 80 ? 'text-green-600' :
                                            role.readinessScore >= 50 ? 'text-yellow-600' : 'text-red-500'
                                            }`}>{role.readinessScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${role.readinessScore >= 80 ? 'bg-green-500' :
                                                role.readinessScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                                }`}
                                            style={{ width: `${role.readinessScore}%` }}
                                        ></div>
                                    </div>
                                    {role.missingSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            <span className="text-xs text-gray-400 mr-1">Missing:</span>
                                            {role.missingSkills.slice(0, 3).map(s => (
                                                <span key={s.key} className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded border border-red-100">{s.name}</span>
                                            ))}
                                            {role.missingSkills.length > 3 && (
                                                <span className="text-xs text-gray-400">+{role.missingSkills.length - 3} more</span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Role requirements met!</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <p>No target roles selected.</p>
                            <Link to="/roles" className="text-indigo-600 hover:underline mt-2 inline-block">Select Roles</Link>
                        </div>
                    )}
                </div>

                {/* Recommended Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                        Next Best Skills
                    </h3>

                    {nextSkills.length > 0 ? (
                        <div className="space-y-4">
                            {nextSkills.slice(0, 5).map((skill, index) => (
                                <div key={skill.skillKey} className="flex items-start p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition group relative">
                                    <div className={`mt-1 h-6 w-6 rounded-full mr-4 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${index === 0 ? 'bg-indigo-600' : 'bg-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition">{skill.skillName}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="inline-flex items-start">
                                                <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                                <span>{skill.reason}</span>
                                            </span>
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            <p>You are up to date! Explore more skills.</p>
                            <Link to="/skills" className="text-indigo-600 hover:underline mt-2 inline-block">Browse Skills</Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

function CheckCircle({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> }

export default Dashboard;
