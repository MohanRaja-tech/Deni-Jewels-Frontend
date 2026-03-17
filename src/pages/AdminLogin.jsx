import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await adminLogin(email, password);
            toast.success('Welcome, Admin! 🛡️');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 via-warm-white to-champagne/20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 shadow-luxury-lg border-primary-200/30">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600
              rounded-full flex items-center justify-center mx-auto mb-4 shadow-luxury">
                            <FiShield className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-xl font-serif font-semibold text-gray-800">Admin Access</h2>
                        <p className="text-sm text-gray-400 mt-1">Secure administrator login</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin email"
                                className="input-luxury pl-11"
                            />
                        </div>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin password"
                                className="input-luxury pl-11 pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
