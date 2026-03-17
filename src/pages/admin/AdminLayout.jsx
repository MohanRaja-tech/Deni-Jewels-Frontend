import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    FiGrid, FiPackage, FiStar, FiLogOut, FiMenu, FiX,
    FiChevronRight, FiShield, FiPlus, FiFileText
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const sidebarItems = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/products/new', icon: FiPlus, label: 'Add Product' },
    { to: '/admin/home-media', icon: HiOutlineSparkles, label: 'Home Media' },
    { to: '/admin/reports', icon: FiFileText, label: 'Reports' },
];

const AdminLayout = () => {
    const { user, logout, isAdmin } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-pearl pt-20">
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-24 left-4 z-50 p-2 bg-white rounded-xl shadow-lg text-gray-600"
            >
                {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`fixed md:sticky top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white/90 backdrop-blur-lg
          border-r border-primary-100/50 z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="p-6">
                        {/* Admin Header */}
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-primary-100/50">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600
                rounded-full flex items-center justify-center">
                                <FiShield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-gray-800">{user?.name}</p>
                                <p className="text-xs text-primary-500">Administrator</p>
                            </div>
                        </div>

                        {/* Nav Items */}
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = item.exact
                                    ? location.pathname === item.to
                                    : location.pathname.startsWith(item.to) && item.to !== '/admin';
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                      transition-all duration-200
                      ${isActive
                                                ? 'bg-primary-100 text-primary-700 font-medium'
                                                : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                        {isActive && <FiChevronRight className="w-3 h-3 ml-auto" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm
                  text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                                <FiLogOut className="w-4 h-4" />
                                Logout
                            </button>
                            <Link
                                to="/"
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm
                  text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all mt-1"
                            >
                                <HiOutlineSparkles className="w-4 h-4" />
                                View Website
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-5rem)] md:ml-0">
                    <div className="p-4 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/20 z-30 md:hidden"
                />
            )}
        </div>
    );
};

export default AdminLayout;
