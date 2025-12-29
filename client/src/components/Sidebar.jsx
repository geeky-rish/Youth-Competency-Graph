import { LayoutDashboard, Target, BookOpen, User, Settings, LogOut, ChartBar } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ChartBar, label: 'Skills Graph', path: '/skills' },
        { icon: Target, label: 'Target Roles', path: '/roles' },
        { icon: BookOpen, label: 'Learning Path', path: '/learning' },
        { icon: User, label: 'Profile', path: '/profile' }, // We'll add this route
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0 bg-white border-r border-gray-200 shadow-sm">
            <div className="h-full px-3 py-4 overflow-y-auto">
                <div className="flex items-center pl-2.5 mb-8 mt-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">Y</span>
                    </div>
                    <span className="self-center text-xl font-bold whitespace-nowrap text-gray-800">
                        Competency<span className="text-indigo-600">Graph</span>
                    </span>
                </div>

                <ul className="space-y-2 font-medium">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg group transition-colors duration-200 ${isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon className={`w-5 h-5 transition duration-75 ${({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-900'
                                    }`} />
                                <span className="ml-3">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="absolute bottom-4 left-0 w-full px-3">
                    <button
                        onClick={handleLogout}
                        className="flex items-center p-3 w-full text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="ml-3">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
