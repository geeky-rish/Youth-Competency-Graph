import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Search, Check, Plus, Book } from 'lucide-react';

const Skills = () => {
    const { user } = useAuth();
    const [allSkills, setAllSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [skillsRes, userRes] = await Promise.all([
                api.get('/skills'),
                api.get('/auth/me')
            ]);

            setAllSkills(skillsRes.data);
            setUserSkills(userRes.data.skills);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = async (skillKey) => {
        if (updating) return;

        // Optimistic Update
        const isSelected = userSkills.includes(skillKey);
        let newSkills = [...userSkills];
        if (isSelected) {
            newSkills = newSkills.filter(k => k !== skillKey);
        } else {
            newSkills.push(skillKey);
        }
        setUserSkills(newSkills);
        setUpdating(true);

        try {
            await api.put('/profile/skills', { skills: newSkills });
        } catch (error) {
            console.error("Error updating skills", error);
            // Revert on error
            setUserSkills(userSkills);
            alert("Failed to update skill. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const filteredSkills = allSkills.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );

    const categories = [...new Set(allSkills.map(s => s.category))];

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Skills</h1>
                    <p className="text-gray-500">Select the skills you have mastered.</p>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search skills..."
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {categories.map(category => {
                        const categorySkills = filteredSkills.filter(s => s.category === category);
                        if (categorySkills.length === 0) return null;

                        return (
                            <div key={category}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">{category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {categorySkills.map(skill => {
                                        const isSelected = userSkills.includes(skill.key);
                                        return (
                                            <div
                                                key={skill.key}
                                                onClick={() => toggleSkill(skill.key)}
                                                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative group ${isSelected
                                                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Book className="w-5 h-5" />
                                                    </div>
                                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${isSelected
                                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                                            : 'border-gray-300 text-transparent group-hover:border-indigo-400'
                                                        }`}>
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <h4 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>{skill.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{skill.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Layout>
    );
};

export default Skills;
