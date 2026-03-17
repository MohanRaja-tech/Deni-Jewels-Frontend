import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setSavingProfile(true);
            const res = await authAPI.updateProfile(profileData);
            updateUser(res.data.data);
            toast.success('Profile updated! ✨');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        try {
            setSavingPassword(true);
            await authAPI.changePassword(passwordData);
            setPasswordData({ currentPassword: '', newPassword: '' });
            toast.success('Password changed successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-warm-white">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">
                        My <span className="gold-text">Profile</span>
                    </h1>

                    {/* Profile Info */}
                    <div className="glass-card p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiUser className="w-5 h-5 text-primary-500" />
                            Personal Information
                        </h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="input-luxury"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Email</label>
                                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-400">
                                    <FiMail className="w-4 h-4" />
                                    {user?.email}
                                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded ml-auto">
                                        Cannot change
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Phone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="input-luxury"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <button type="submit" disabled={savingProfile}
                                className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                                <FiSave className="w-4 h-4" />
                                {savingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiLock className="w-5 h-5 text-primary-500" />
                            Change Password
                        </h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="input-luxury"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="input-luxury"
                                    placeholder="Min 6 characters"
                                />
                            </div>
                            <button type="submit" disabled={savingPassword}
                                className="btn-outline text-sm flex items-center gap-2 disabled:opacity-50">
                                <FiLock className="w-4 h-4" />
                                {savingPassword ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
