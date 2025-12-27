import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { Clock, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const PsychometricTest = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [testStarted, setTestStarted] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/psychometric/start');
                setQuestions(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load questions", error);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (!testStarted || loading) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, loading]);

    const handleAnswer = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await api.post('/psychometric/submit', { answers });
            navigate('/psychometric-result', { state: { result: res.data } });
        } catch (error) {
            console.error("Submission failed", error);
            setLoading(false);
            setShowConfirmSubmit(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    if (!testStarted) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto py-12 px-4">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                                <Clock className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Psychometric Assessment</h1>
                            <p className="text-gray-500 mt-2">Evaluate your cognitive aptitude and work style.</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                                <h3 className="font-semibold text-indigo-900 mb-4">Instructions</h3>
                                <ul className="space-y-3 text-indigo-800">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Total Duration: <strong>60 Minutes</strong></span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Format: <strong>Multiple Choice Questions</strong></span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Sections: Numerical, Verbal, Logical, Abstract, Situational, Spatial</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>You can navigate between questions freely using the palette.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex items-start">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> Ensure you have a stable internet connection. Do not refresh the page once the test starts, or your progress may be lost.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setTestStarted(true)}
                                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-0.5"
                            >
                                Start Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <div>No questions loaded.</div>;

    const progress = (Object.keys(answers).length / questions.length) * 100;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-4 z-10">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Psychometric Assessment</h1>
                        <p className="text-sm text-gray-500">Section: <span className="font-semibold text-indigo-600">{currentQuestion.section}</span></p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Time Remaining</span>
                            <div className={`flex items-center font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                                <Clock className="w-5 h-5 mr-2" />
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowConfirmSubmit(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Finish Test
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                        <span>Progress</span>
                        <span>{Object.keys(answers).length} / {questions.length} Answered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px] flex flex-col">
                    <div className="mb-6">
                        <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
                            {currentQuestion.questionText}
                        </h2>
                    </div>

                    <div className="space-y-3 flex-grow">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(currentQuestion._id, option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center ${answers[currentQuestion._id] === option
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border border-gray-400 mr-4 flex items-center justify-center ${answers[currentQuestion._id] === option ? 'border-indigo-600 bg-indigo-600' : ''
                                    }`}>
                                    {answers[currentQuestion._id] === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${currentQuestionIndex === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                        </button>

                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${currentQuestionIndex === questions.length - 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            Next <ChevronRight className="w-5 h-5 ml-1" />
                        </button>
                    </div>
                </div>

                {/* Question Palette */}
                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">Question Palette</h3>
                    <div className="flex flex-wrap gap-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q._id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition ${currentQuestionIndex === idx
                                        ? 'ring-2 ring-offset-1 ring-indigo-600 bg-white border border-indigo-600 text-indigo-600'
                                        : answers[q._id]
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex items-center text-amber-500 mb-4">
                            <AlertTriangle className="w-8 h-8 mr-3" />
                            <h3 className="text-xl font-bold text-gray-900">Finish Assessment?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            You have answered <strong className="text-gray-900">{Object.keys(answers).length} of {questions.length}</strong> questions.
                            {Object.keys(answers).length < questions.length && " Unanswered questions will be marked as incorrect."}
                            <br /><br />
                            Are you sure you want to submit? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg"
                            >
                                Yes, Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default PsychometricTest;
