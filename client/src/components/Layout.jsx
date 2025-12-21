import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Sidebar />
            <Navbar toggleSidebar={toggleSidebar} />
            <main className="p-4 sm:ml-64 pt-20 transition-all">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[calc(100vh-6rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
