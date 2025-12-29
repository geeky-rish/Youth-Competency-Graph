import { Bell, Search, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = ({ toggleSidebar }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 sm:ml-64 fixed w-full z-30 top-0 left-0 sm:w-[calc(100%-16rem)] transition-all">
            <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center justify-start">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer sm:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 placeholder-gray-400"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {/* Breadcrumb or Page Title can go here */}
                    <span className="text-gray-400 text-sm hidden md:inline-block">Welcome back, {user?.name || 'Student'}</span>
                </div>
                <div className="flex items-center lg:order-2">
                    <div className="relative mr-4 hidden md:block">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2"
                            placeholder="Search skills..."
                        />
                    </div>
                    <button className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="flex items-center ml-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
