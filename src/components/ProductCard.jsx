import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, truncateText, getMetalTypeName } from '../utils/helpers';

const ProductCard = ({ product }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const inWishlist = isInWishlist(product._id);

    const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515562141589-67f0d64d4866?w=400';
    const price = product.priceInfo?.totalPrice || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="product-card"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-champagne/30 to-pearl">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                    />
                </Link>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (!inWishlist) toggleWishlist(product._id);
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg backdrop-blur-sm
            ${inWishlist
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                >
                    <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-600
            text-xs font-medium rounded-full tracking-wide shadow-sm">
                        {product.category}
                    </span>
                </div>

                {/* Stock Warning */}
                {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-amber-500/90 text-white text-xs font-medium
              rounded-full backdrop-blur-sm">
                            Only {product.stockQuantity} left
                        </span>
                    </div>
                )}

                {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="px-6 py-2 bg-gray-800/80 text-white text-sm font-medium rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-5">
                {/* Metal Type & Purity */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">
                        {getMetalTypeName(product.metalType)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-primary-300" />
                    <span className="text-xs text-gray-400">{product.purity}</span>
                    <span className="w-1 h-1 rounded-full bg-primary-300" />
                    <span className="text-xs text-gray-400">{product.weight}g</span>
                </div>

                {/* Name */}
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-serif font-semibold text-lg text-gray-800 mb-1
            group-hover:text-primary-600 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {truncateText(product.description, 80)}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {product.averageRating > 0 ? (
                        <>
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating)
                                            ? 'text-amber-400'
                                            : 'text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 ml-1">
                                ({product.totalReviews})
                            </span>
                        </>
                    ) : (
                        <span className="text-xs text-gray-300">No reviews yet</span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xl font-serif font-bold text-gray-800">
                            {formatPrice(price)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            Incl. GST & Making Charges
                        </p>
                    </div>
                    <Link
                        to={`/product/${product._id}`}
                        className="text-xs font-medium text-primary-500 hover:text-primary-700
              transition-colors underline underline-offset-2"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
