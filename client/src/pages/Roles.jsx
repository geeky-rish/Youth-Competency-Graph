import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { Target, CheckCircle, Circle } from 'lucide-react';

const Roles = () => {
    const [allRoles, setAllRoles] = useState([]);
    const [userTargets, setUserTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rolesRes, userRes] = await Promise.all([
                api.get('/roles'),
                api.get('/auth/me')
            ]);

            setAllRoles(rolesRes.data);
            setUserTargets(userRes.data.targetRoles);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (roleKey) => {
        if (updating) return;

        // Optimistic Update
        const isSelected = userTargets.includes(roleKey);
        let newTargets = [...userTargets];
        if (isSelected) {
            newTargets = newTargets.filter(k => k !== roleKey);
        } else {
            newTargets.push(roleKey);
        }
        setUserTargets(newTargets);
        setUpdating(true);

        try {
            await api.put('/profile/targets', { targetRoles: newTargets });
        } catch (error) {
            console.error("Error updating targets", error);
            // Revert
            setUserTargets(userTargets);
            alert("Failed to update roles. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Target Roles</h1>
                <p className="text-gray-500">Choose the career paths you want to pursue.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {allRoles.map(role => {
                        const isSelected = userTargets.includes(role.key);
                        return (
                            <div
                                key={role.key}
                                onClick={() => toggleRole(role.key)}
                                className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 relative ${isSelected
                                        ? 'bg-emerald-50 border-emerald-200 shadow-md ring-1 ring-emerald-500'
                                        : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <Target className={`w-5 h-5 mr-2 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                                            <h3 className={`text-xl font-bold ${isSelected ? 'text-emerald-900' : 'text-gray-800'}`}>{role.name}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4 text-sm">{role.description}</p>

                                        <div className="mt-4">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {role.requiredSkills.slice(0, 5).map(skillKey => (
                                                    <span key={skillKey} className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-white text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {skillKey} {/* In real app we'd map key to name */}
                                                    </span>
                                                ))}
                                                {role.requiredSkills.length > 5 && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`mt-1 ${isSelected ? 'text-emerald-600' : 'text-gray-300'}`}>
                                        {isSelected ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Layout>
    );
};

export default Roles;
