import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productAPI } from '../../services/api';
import { FiPackage, FiAlertTriangle, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const prodRes = await productAPI.getStats();
                setStats(prodRes.data.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="spinner" />
        </div>
    );

    const statCards = [
        { icon: FiPackage, label: 'Total Products', value: stats?.totalProducts || 0, color: 'from-blue-500 to-blue-600' },
        { icon: FiEye, label: 'Active Products', value: stats?.enabledProducts || 0, color: 'from-green-500 to-green-600' },
        { icon: FiEyeOff, label: 'Disabled Products', value: stats?.disabledProducts || 0, color: 'from-gray-400 to-gray-500' },
        { icon: FiAlertTriangle, label: 'Low Stock', value: stats?.lowStockProducts || 0, color: 'from-amber-500 to-amber-600' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map(({ icon: Icon, label, value, color }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-4"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color}
              flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                        <p className="text-xs text-gray-400 mt-1">{label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h2>
                    <div className="space-y-3">
                        {stats?.categoryStats?.map((cat) => (
                            <div key={cat._id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{cat._id}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                                            style={{ width: `${(cat.count / (stats?.totalProducts || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 w-8 text-right">{cat.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiAlertTriangle className="w-4 h-4 text-amber-500" />
                        Low Stock Alerts
                    </h2>
                    {stats?.lowStockItems?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.lowStockItems.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.category}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${item.stockQuantity === 0
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {item.stockQuantity === 0 ? 'Out of Stock' : `${item.stockQuantity} left`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-8">All products are well stocked</p>
                    )}
                </div>

                {/* Metal Distribution */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Metal Type Distribution</h2>
                    <div className="space-y-3">
                        {stats?.metalTypeStats?.map((metal) => (
                            <div key={metal._id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 capitalize">{metal._id}</span>
                                <span className="text-sm font-medium text-gray-700">{metal.count} products</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
