import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, homeMediaAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LiveRates from '../components/LiveRates';
import FeaturedShowroom from '../components/FeaturedShowroom';
import Loading from '../components/Loading';
import { getCategoryEmoji } from '../utils/helpers';
import { HiOutlineSparkles, HiArrowRight } from 'react-icons/hi';
import { FiShield, FiAward, FiTruck, FiRefreshCw } from 'react-icons/fi';

const categories = ['Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal'];

const features = [
    { icon: FiShield, title: 'Certified Purity', desc: 'BIS Hallmarked jewellery with guaranteed purity' },
    { icon: FiAward, title: 'Premium Craftsmanship', desc: 'Handcrafted by master artisans with decades of expertise' },
    { icon: FiTruck, title: 'Insured Delivery', desc: 'Fully insured doorstep delivery across India' },
    { icon: FiRefreshCw, title: 'Lifetime Exchange', desc: 'Hassle-free exchange and buyback policy' },
];

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [homeMedia, setHomeMedia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, mediaRes] = await Promise.all([
                    productAPI.getAll({ limit: 8, sort: 'rating' }),
                    homeMediaAPI.get()
                ]);
                setFeaturedProducts(productsRes.data.data || []);
                setHomeMedia(mediaRes.data.data || null);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center bg-hero-gradient overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-champagne/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 mb-6"
                            >
                                <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium text-primary-500 uppercase tracking-[0.2em]">
                                    Exquisite Collection 2024
                                </span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
                                Where
                                <span className="gold-text"> Elegance </span>
                                <br />Meets
                                <span className="gold-text"> Tradition</span>
                            </h1>

                            <p className="text-lg text-gray-500 max-w-lg mb-8 leading-relaxed">
                                Discover our handcrafted collection of premium jewellery, designed to celebrate
                                life's most precious moments with timeless grace and Indian artistry.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/collections" className="btn-primary flex items-center gap-2">
                                    Explore Collection
                                    <HiArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/about" className="btn-outline">
                                    Our Story
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-6 mt-10 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-500">✦</span> BIS Hallmarked
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-500">✦</span> Certified Diamonds
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-500">✦</span> Since 2004
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full aspect-square max-w-lg mx-auto">
                                {/* Background circle */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-champagne/40
                  rounded-full blur-md" />
                                <div className="absolute inset-4 bg-gradient-to-br from-white/60 to-pearl
                  rounded-full shadow-luxury-lg overflow-hidden flex items-center justify-center p-2">
                                    {homeMedia ? (
                                        homeMedia.type === 'video' ? (
                                            <video
                                                src={homeMedia.url}
                                                className="w-full h-full object-cover rounded-full"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={homeMedia.url}
                                                alt="Premium Gold Jewellery"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        )
                                    ) : (
                                        <img
                                            src="https://images.unsplash.com/photo-1599643478518-a92f81789bcb?w=800&q=80"
                                            alt="Premium Gold Jewellery"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    )}
                                </div>

                                {/* Floating badges */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    className="absolute -top-2 right-10 glass-card px-4 py-2 shadow-luxury"
                                >
                                    <p className="text-xs text-gray-400">Starting from</p>
                                    <p className="text-lg font-serif font-bold text-primary-600">₹20,000</p>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                                    className="absolute bottom-8 -left-4 glass-card px-4 py-2 shadow-luxury"
                                >
                                    <p className="text-xs font-medium text-primary-500">✨ New Arrivals</p>
                                    <p className="text-sm text-gray-600">Bridal Collection</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Live Rates Section */}
            <LiveRates />

            {/* Featured Showroom (Videos/Dynamic Media) */}
            <FeaturedShowroom />

            {/* Categories Section */}
            <section className="py-20 bg-warm-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-heading">
                            Browse by <span className="gold-text">Category</span>
                        </h2>
                        <p className="section-subheading">
                            Explore our curated collections across exquisite categories
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/collections?category=${category}`}
                                    className="glass-card p-8 text-center block hover:shadow-luxury-lg
                    transition-all duration-500 hover:-translate-y-2 group"
                                >
                                    <span className="text-4xl mb-4 block group-hover:scale-110
                    transition-transform duration-300">
                                        {getCategoryEmoji(category)}
                                    </span>
                                    <h3 className="font-serif font-semibold text-gray-800 group-hover:text-primary-600
                    transition-colors">
                                        {category}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">View Collection →</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-gradient-to-b from-warm-white to-pearl/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-heading">
                            Featured <span className="gold-text">Pieces</span>
                        </h2>
                        <p className="section-subheading">
                            Our most coveted creations, handpicked for the discerning connoisseur
                        </p>
                    </motion.div>

                    {loading ? (
                        <Loading text="Loading exquisite pieces..." />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.slice(0, 8).map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-center mt-12"
                            >
                                <Link to="/collections" className="btn-primary inline-flex items-center gap-2">
                                    View All Collections
                                    <HiArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-r from-champagne/20 via-warm-white to-champagne/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-heading">
                            Why Choose <span className="gold-text">Lumière</span>
                        </h2>
                        <p className="section-subheading">
                            Four pillars of trust that define our commitment to excellence
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map(({ icon: Icon, title, desc }, index) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-7 text-center hover:shadow-luxury transition-all duration-300
                  hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-champagne/50
                  rounded-full flex items-center justify-center mx-auto mb-5">
                                    <Icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="font-serif font-semibold text-lg text-gray-800 mb-2">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><circle cx=%2230%22 cy=%2230%22 r=%221.5%22 fill=%22white%22/></svg>')] bg-repeat" />
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                            Visit Our Showroom
                        </h2>
                        <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                            Experience the brilliance in person. Visit our flagship showroom in Mumbai
                            to explore our latest collections with expert guidance.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600
                rounded-full font-medium hover:bg-primary-50 transition-all duration-300
                shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            Get Directions
                            <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
