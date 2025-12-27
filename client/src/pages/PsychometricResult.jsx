import { useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Award, BarChart2, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

const PsychometricResult = () => {
    const { state } = useLocation();
    const result = state?.result;

    if (!result) {
        return (
            <Layout>
                <div className="p-8 text-center text-gray-500">
                    <p>No results found. Please complete the assessment first.</p>
                    <Link to="/psychometric-test" className="text-indigo-600 underline mt-4 inline-block">Take Assessment</Link>
                </div>
            </Layout>
        );
    }

    const { score, sectionScores, insights } = result;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-indigo-900 p-8 text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
                            <p className="text-indigo-200">Here is your comprehensive aptitude profile.</p>

                            <div className="mt-8 mb-4">
                                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-indigo-400 bg-indigo-800 shadow-2xl">
                                    <div className="text-center">
                                        <span className="block text-4xl font-bold">{score}%</span>
                                        <span className="text-xs uppercase tracking-wide opacity-80">Overall Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <BarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
                            Sectional Breakdown
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {Object.entries(sectionScores).map(([section, score]) => (
                                <div key={section}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{section}</span>
                                        <span className="text-sm font-bold text-gray-900">{score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-blue-500' : 'bg-orange-400'
                                                }`}
                                            style={{ width: `${score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-purple-600" />
                                Professional Insights
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InsightCard title="Analytical Strength" value={insights.analytical_strength} />
                                <InsightCard title="Behavioural Maturity" value={insights.behavioural_maturity} />
                                <InsightCard title="Spatial Reasoning" value={insights.spatial_reasoning} />
                                <InsightCard title="Logical Strength" value={insights.logical_strength} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Disclaimer: This assessment supports guidance and mentorship. It is not a sole determinant for role selection.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link
                        to="/dashboard"
                        className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm"
                    >
                        Back to Dashboard
                    </Link>
                    <Link
                        to="/psychometric-test"
                        className="flex items-center px-6 py-3 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition shadow-sm"
                    >
                        Retake Test
                    </Link>
                    <Link
                        to="/learning"
                        className="flex items-center px-6 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition shadow-lg"
                    >
                        View Learning Path <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

const InsightCard = ({ title, value }) => {
    const isStrong = value.includes("Strong") || value.includes("Good") || value.includes("High");

    return (
        <div className={`p-4 rounded-xl border ${isStrong ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</h4>
            <div className="flex items-center">
                {isStrong && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                <p className={`font-medium ${isStrong ? 'text-green-800' : 'text-gray-800'}`}>{value}</p>
            </div>
        </div>
    );
};

export default PsychometricResult;
