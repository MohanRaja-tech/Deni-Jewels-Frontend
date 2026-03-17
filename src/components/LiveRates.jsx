import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rateAPI } from '../services/api';
import { formatPrice, getRateDisplayName, timeAgo } from '../utils/helpers';
import { HiTrendingUp } from 'react-icons/hi';
import { FiRefreshCw } from 'react-icons/fi';

const AnimatedRateCard = ({ rate, index }) => {
    const [particles, setParticles] = useState([]);

    const spawnParticles = () => {
        const newParticles = Array.from({ length: 10 }).map((_, i) => ({
            id: Math.random(),
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            size: Math.random() * 15 + 10,
            rotation: Math.random() * 360,
            duration: Math.random() * 0.5 + 0.5
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 800);
    };

    const getMetalEmoji = (type) => {
        if (type.includes('gold')) return '🪙';
        if (type === 'silver') return '🥈';
        if (type === 'platinum') return '💎';
        if (type === 'diamond') return '✨';
        return '✨';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={spawnParticles}
            onTouchStart={spawnParticles}
            className="glass-card p-5 text-center hover:shadow-luxury transition-all duration-300
                  hover:-translate-y-1 group relative overflow-visible cursor-pointer"
        >
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                        animate={{
                            opacity: 0,
                            scale: 1.5,
                            x: p.x,
                            y: p.y,
                            rotate: p.rotation
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: p.duration, ease: "easeOut" }}
                        className="absolute left-1/2 top-1/2 pointer-events-none z-20 text-xl"
                        style={{ marginLeft: '-10px', marginTop: '-10px' }}
                    >
                        {getMetalEmoji(rate.metalType)}
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="relative z-10 pt-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {getRateDisplayName(rate.metalType)}
                </h3>
                <p className="text-2xl font-serif font-bold text-gray-800 mb-1">
                    {formatPrice(rate.ratePerUnit)}
                </p>
                <p className="text-xs text-gray-400">
                    per {rate.unit === 'carat' ? 'carat' : 'gram'}
                </p>
            </div>

            {/* Decorative circle that appears on hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-500/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 -z-0" />
        </motion.div>
    );
};

const LiveRates = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const res = await rateAPI.get();
            setRates(res.data.data || []);
            if (res.data.data?.length > 0) {
                setLastUpdated(res.data.data[0].lastUpdated);
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 30 * 60 * 1000); // Changed to 30 mins as per text
        return () => clearInterval(interval);
    }, []);

    const rateOrder = ['gold_24k', 'gold_22k', 'silver', 'platinum', 'diamond'];

    const sortedRates = rateOrder
        .map((type) => rates.find((r) => r.metalType === type))
        .filter(Boolean);

    return (
        <section className="py-16 bg-gradient-to-r from-warm-white via-champagne/20 to-warm-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <HiTrendingUp className="w-5 h-5 text-primary-500" />
                        <span className="text-sm font-medium text-primary-500 uppercase tracking-widest">
                            Live Market Rates
                        </span>
                    </div>
                    <h2 className="section-heading">
                        Today's <span className="gold-text">Indian Market</span> Rates
                    </h2>
                    <p className="section-subheading">
                        Real-time precious metal rates from Indian commodity markets, updated automatically
                    </p>
                </motion.div>

                {/* Rate Cards */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="spinner" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {sortedRates.map((rate, index) => (
                            <AnimatedRateCard key={rate.metalType} rate={rate} index={index} />
                        ))}
                    </div>
                )}

                {/* Last Updated */}
                {lastUpdated && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-6 flex items-center justify-center gap-2"
                    >
                        <FiRefreshCw className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                            Last updated: {timeAgo(lastUpdated)} • Rates auto-refresh every 30 minutes
                        </span>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default LiveRates;
