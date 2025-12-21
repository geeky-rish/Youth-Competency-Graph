import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Book, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                            <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100 capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                    <div className="flex items-center text-gray-500 mb-6">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800 flex items-center">
                                    <Book className="w-5 h-5 mr-2 text-indigo-500" />
                                    Skills
                                </h3>
                                <Link to="/skills" className="text-sm text-indigo-600 hover:underline">Manage</Link>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.length > 0 ? (
                                    user.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-700">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400">No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800 flex items-center">
                                    <Target className="w-5 h-5 mr-2 text-emerald-500" />
                                    Target Roles
                                </h3>
                                <Link to="/roles" className="text-sm text-indigo-600 hover:underline">Manage</Link>
                            </div>
                            <div className="space-y-2">
                                {user.targetRoles.length > 0 ? (
                                    user.targetRoles.map(role => (
                                        <div key={role} className="flex items-center text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                            {role}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400">No target roles selected.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
