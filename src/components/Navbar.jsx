import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiShield } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/collections', label: 'Collections' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-primary-100/50 shadow-soft"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="group flex flex-col items-start leading-none">
                        <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight gold-text">
                            DENI
                        </h1>
                        <p className="text-[10px] md:text-xs tracking-[0.5em] text-primary-500 font-bold uppercase ml-0.5">
                            Jewellers
                        </p>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-gray-600 hover:text-primary-600 font-medium text-sm tracking-wide
                  transition-colors duration-300 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500
                  group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <FiHeart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs
                    rounded-full flex items-center justify-center font-medium"
                                >
                                    {wishlistCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-2 rounded-full hover:bg-primary-50
                    transition-colors text-gray-600 hover:text-primary-600"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span className="text-sm font-medium max-w-[100px] truncate">
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-elegant
                        border border-primary-100/50 overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-primary-50">
                                                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                                                <p className="text-xs text-gray-400">{user?.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
                            hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                                >
                                                    <FiSettings className="w-4 h-4" />
                                                    Profile Settings
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-600
                            hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <FiLogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50
                  text-primary-600 hover:bg-primary-100 transition-colors text-sm font-medium"
                            >
                                <FiUser className="w-4 h-4" />
                                Login
                            </Link>
                        )}

                        {/* Admin Link */}
                        {isAdmin ? (
                            <Link
                                to="/admin"
                                className="flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r
                  from-primary-500 to-primary-600 text-white text-sm font-medium
                  hover:from-primary-600 hover:to-primary-700 transition-all shadow-luxury"
                            >
                                <FiShield className="w-4 h-4" />
                                Admin
                            </Link>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                title="Admin Login"
                            >
                                <FiShield className="w-5 h-5" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-lg border-t border-primary-100/50"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-gray-600 hover:text-primary-600 font-medium
                    transition-colors border-b border-primary-50/50"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/wishlist"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 py-2 text-gray-600 hover:text-primary-600
                  font-medium transition-colors border-b border-primary-50/50"
                            >
                                <FiHeart className="w-4 h-4" />
                                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="block py-2 text-red-500 font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-primary-600 font-medium"
                                >
                                    Login / Register
                                </Link>
                            )}
                            {isAdmin ? (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-primary text-center block"
                                >
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/admin/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 py-2 text-gray-400 text-sm"
                                >
                                    <FiShield className="w-4 h-4" />
                                    Admin Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
