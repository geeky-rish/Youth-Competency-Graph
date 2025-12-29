import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './redux/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Roles from './pages/Roles';
import Learning from './pages/Learning';
import Profile from './pages/Profile';
import ResourceRecommendations from './pages/ResourceRecommendations';
import PsychometricTest from './pages/PsychometricTest';
import PsychometricResult from './pages/PsychometricResult';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    return user ? children : <Navigate to="/login" />;
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/skills" element={<PrivateRoute><Skills /></PrivateRoute>} />
                <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
                <Route path="/learning" element={<PrivateRoute><Learning /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/recommendations" element={<PrivateRoute><ResourceRecommendations /></PrivateRoute>} />
                <Route path="/psychometric-test" element={<PrivateRoute><PsychometricTest /></PrivateRoute>} />
                <Route path="/psychometric-result" element={<PrivateRoute><PsychometricResult /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
