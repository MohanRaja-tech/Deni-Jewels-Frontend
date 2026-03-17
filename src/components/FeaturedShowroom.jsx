import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { HiOutlineSparkles, HiArrowRight } from 'react-icons/hi';
import { formatPrice } from '../utils/helpers';

const FeaturedShowroom = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchShowcase = async () => {
            try {
                const res = await productAPI.getAll({ limit: 8 });
                const allProducts = res.data.data || [];
                setProducts(allProducts.slice(0, 6));
            } catch (error) {
                console.error('Error fetching showcase:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchShowcase();
    }, []);

    // Auto-rotate through products
    useEffect(() => {
        if (products.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % products.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [products.length]);

    if (loading || products.length === 0) return null;

    const activeProduct = products[activeIndex];

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center lg:text-left"
                >
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                        <HiOutlineSparkles className="w-5 h-5 text-primary-400" />
                        <span className="text-sm font-medium text-primary-400 uppercase tracking-[0.3em]">Curated Collection</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Featured <span className="gold-text">Masterpieces</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto lg:mx-0">
                        Explore our handpicked selection of exquisite jewellery pieces, each crafted with
                        precision and adorned with the finest materials.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-8 items-center">
                    {/* Left Side: Image Display */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProduct._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                                className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-900 shadow-2xl border border-white/10 group"
                            >
                                <img
                                    src={activeProduct.images?.[0]?.url || 'https://via.placeholder.com/800x600'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={activeProduct.name}
                                />

                                {/* Overlay Information */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-semibold rounded-full border border-primary-500/30 mb-4 inline-block backdrop-blur-md">
                                            {activeProduct.category}
                                        </span>
                                        <h3 className="text-3xl font-serif font-bold text-white mb-2">{activeProduct.name}</h3>
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-gray-300 text-sm max-w-md line-clamp-2 mb-2">
                                                    {activeProduct.description}
                                                </p>
                                                <p className="text-primary-400 font-semibold text-lg">
                                                    {formatPrice(activeProduct.priceInfo?.totalPrice)}
                                                </p>
                                            </div>
                                            <Link to={`/product/${activeProduct._id}`} className="shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-primary-500 hover:text-white transition-all transform hover:scale-110">
                                                <HiArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side: List of items */}
                    <div className="lg:col-span-2 space-y-4">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveIndex(index)}
                                className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${activeIndex === index
                                    ? 'bg-white/10 border-primary-500/50 shadow-luxury'
                                    : 'bg-transparent border-white/5 hover:bg-white/5'
                                    }`}
                            >
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                    <img src={product.images?.[0]?.url || 'https://via.placeholder.com/64'} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium transition-colors ${activeIndex === index ? 'text-primary-400' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {activeIndex === index ? 'Currently Viewing' : 'Featured Piece'}
                                    </p>
                                    <h4 className={`text-lg font-serif font-semibold truncate ${activeIndex === index ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                        {product.name}
                                    </h4>
                                </div>
                                {activeIndex === index && (
                                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedShowroom;
