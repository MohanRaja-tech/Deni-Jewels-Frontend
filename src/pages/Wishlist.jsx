import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { formatPrice, getMetalTypeName } from '../utils/helpers';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';

const Wishlist = () => {
    const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    if (loading) return <div className="pt-28"><Loading text="Loading your wishlist..." /></div>;

    return (
        <div className="min-h-screen pt-24 bg-warm-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-serif font-bold text-gray-800">
                        My <span className="gold-text">Wishlist</span>
                    </h1>
                    <p className="text-gray-400 mt-1">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                </motion.div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {wishlist.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="glass-card overflow-hidden group"
                                >
                                    <Link to={`/product/${product._id}`}>
                                        <div className="aspect-square bg-gradient-to-br from-champagne/20 to-pearl overflow-hidden">
                                            <img
                                                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515562141589-67f0d64d4866?w=400'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-primary-500 font-medium uppercase">
                                                {getMetalTypeName(product.metalType)}
                                            </span>
                                            <span className="text-xs text-gray-400">• {product.purity}</span>
                                        </div>
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="font-serif font-semibold text-gray-800 group-hover:text-primary-600
                        transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        {product.averageRating > 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <HiStar className="w-3.5 h-3.5 text-amber-400" />
                                                <span className="text-xs text-gray-400">{product.averageRating}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs text-gray-400">{product.weight}g • {product.category}</span>
                                            <button
                                                onClick={() => removeFromWishlist(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove from wishlist"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <FiHeart className="w-16 h-16 text-primary-200 mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-gray-700 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-400 mb-6">Start exploring and save your favorite pieces</p>
                        <Link to="/collections" className="btn-primary">Explore Collections</Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
