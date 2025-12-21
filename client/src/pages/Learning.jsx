import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { Plus, Check, Clock, Calendar, BarChart, BookOpen, PenTool, Hash, ArrowRight } from 'lucide-react';

const Learning = () => {
    const [path, setPath] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPathAndActivities();
    }, []);

    const fetchPathAndActivities = async () => {
        try {
            const [graphRes, activitiesRes] = await Promise.all([
                api.get('/graph/skills'),
                api.get('/learning')
            ]);

            const { nodes, edges, recommendedNext, mastered } = graphRes.data;
            const log = activitiesRes.data;
            setActivities(log);

            // Topological Sort Logic
            // 1. Build Adjacency List and In-Degree
            const adj = new Map();
            const inDegree = new Map();
            const allSkillKeys = new Set(nodes.map(n => n.id));

            allSkillKeys.forEach(key => {
                adj.set(key, []);
                inDegree.set(key, 0);
            });

            edges.forEach(edge => {
                if (adj.has(edge.source) && adj.has(edge.target)) {
                    adj.get(edge.source).push(edge.target);
                    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
                }
            });

            // 2. Kahn's Algorithm
            const queue = [];
            allSkillKeys.forEach(key => {
                if (inDegree.get(key) === 0) queue.push(key);
            });

            const sortedOrder = [];
            while (queue.length > 0) {
                const u = queue.shift();
                sortedOrder.push(u);

                if (adj.has(u)) {
                    adj.get(u).forEach(v => {
                        inDegree.set(v, inDegree.get(v) - 1);
                        if (inDegree.get(v) === 0) queue.push(v);
                    });
                }
            }

            // 3. Map back to node objects with status
            const pathData = sortedOrder.map(key => {
                const node = nodes.find(n => n.id === key);
                let status = 'locked';
                if (mastered.includes(key)) status = 'completed';
                else if (recommendedNext.includes(key)) status = 'recommended';
                else if (inDegree.get(key) === 0) status = 'available'; // No prereqs but not explicitly recommended?

                // Check if any activity is in progress for this skill
                const activeLog = log.find(a => a.skillKey === key && a.status !== 'completed');
                if (activeLog) status = 'in_progress';

                return { ...node, status };
            });

            // Filter out 'locked' or irrelevant skills if list is too long? 
            // For now, show all but prioritize visuals.
            setPath(pathData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Learning Path</h1>
                    <p className="text-gray-500">Your personalized curriculum based on dependency logic.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-8">
                        {path.map((skill, index) => (
                            <div key={skill.id} className="relative flex items-start group">
                                {/* Bullet Point */}
                                <div className={`absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10 ${skill.status === 'completed' ? 'bg-green-500 border-green-500' :
                                        skill.status === 'in_progress' ? 'bg-indigo-500 border-indigo-500' :
                                            skill.status === 'recommended' ? 'bg-yellow-400 border-yellow-400' :
                                                'bg-white border-gray-300'
                                    }`}></div>

                                <div className="ml-16 w-full pr-4">
                                    <div className={`p-4 rounded-xl border transition-all ${skill.status === 'completed' ? 'bg-green-50 border-green-100 opacity-75' :
                                            skill.status === 'in_progress' ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-500' :
                                                skill.status === 'recommended' ? 'bg-white border-yellow-200 shadow-sm' :
                                                    'bg-gray-50 border-gray-100 opacity-60'
                                        }`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className={`font-bold ${skill.status === 'completed' ? 'text-green-800' :
                                                        skill.status === 'in_progress' ? 'text-indigo-800' : 'text-gray-800'
                                                    }`}>
                                                    {skill.label}
                                                </h3>
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{skill.category}</span>
                                            </div>

                                            <div className="px-3 py-1 rounded-full text-xs font-medium capitalize">
                                                {skill.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Learning;
