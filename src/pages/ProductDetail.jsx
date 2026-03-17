import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, reviewAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ReviewSection from '../components/ReviewSection';
import Loading from '../components/Loading';
import { formatPrice, getMetalTypeName, formatDate } from '../utils/helpers';
import { FiHeart, FiShare2, FiInfo } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { isInWishlist, toggleWishlist } = useWishlist();

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await productAPI.getById(id);
            setProduct(res.data.data);
            // Fetch reviews
            const revRes = await reviewAPI.getByProduct(id);
            setReviews(revRes.data.data || []);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="pt-28"><Loading text="Loading product details..." /></div>;
    if (!product) return (
        <div className="min-h-screen pt-28 flex items-center justify-center">
            <p className="text-gray-400">Product not found</p>
        </div>
    );

    const mainImage = product.images?.[selectedImage]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515562141589-67f0d64d4866?w=800';

    const priceInfo = product.priceInfo || {};
    const inWishlist = isInWishlist(product._id);

    return (
        <div className="min-h-screen pt-24 bg-warm-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="glass-card overflow-hidden mb-4">
                            <div className="aspect-square bg-gradient-to-br from-champagne/20 to-pearl">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2
                                            transition-all duration-300
                                            ${i === selectedImage
                                                ? 'border-primary-500 shadow-luxury'
                                                : 'border-transparent hover:border-primary-200'
                                            }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Category & SKU */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs
                font-medium rounded-full uppercase tracking-wider">
                                {product.category}
                            </span>
                            {product.sku && (
                                <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                            )}
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-3">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(product.averageRating)
                                            ? 'text-amber-400'
                                            : 'text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                {product.averageRating > 0
                                    ? `${product.averageRating} (${product.totalReviews} reviews)`
                                    : 'No reviews yet'}
                            </span>
                        </div>

                        {/* Price Breakdown */}
                        <div className="glass-card p-6 mb-6">
                            <div className="flex items-baseline justify-between mb-4">
                                <div>
                                    <p className="text-3xl font-serif font-bold text-gray-800">
                                        {formatPrice(priceInfo.totalPrice)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600
                  text-xs font-medium rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Live Rate Price
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>{getMetalTypeName(product.metalType)} ({product.purity}) × {product.weight}g</span>
                                    <span>{formatPrice(priceInfo.basePrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Making Charges</span>
                                    <span>{formatPrice(priceInfo.makingCharge)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>GST ({priceInfo.gstPercentage || 3}%)</span>
                                    <span>{formatPrice(priceInfo.gstAmount)}</span>
                                </div>
                                <div className="border-t border-primary-100 pt-2 flex justify-between font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span>{formatPrice(priceInfo.totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={() => {
                                    if (!inWishlist) toggleWishlist(product._id);
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full
                  font-medium transition-all duration-300
                  ${inWishlist
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'btn-primary'
                                    }`}
                            >
                                <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                            <button
                                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })
                                    .catch(() => {
                                        navigator.clipboard.writeText(window.location.href);
                                    })}
                                className="px-4 py-3.5 rounded-full border-2 border-primary-200 text-primary-600
                  hover:bg-primary-50 transition-all"
                            >
                                <FiShare2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-serif font-semibold text-gray-800">Product Details</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="glass-card p-3">
                                    <p className="text-gray-400 text-xs mb-1">Metal Type</p>
                                    <p className="font-medium text-gray-700 capitalize">{product.metalType}</p>
                                </div>
                                <div className="glass-card p-3">
                                    <p className="text-gray-400 text-xs mb-1">Purity</p>
                                    <p className="font-medium text-gray-700">{product.purity}</p>
                                </div>
                                <div className="glass-card p-3">
                                    <p className="text-gray-400 text-xs mb-1">Weight</p>
                                    <p className="font-medium text-gray-700">{product.weight} grams</p>
                                </div>
                                {product.caratWeight && (
                                    <div className="glass-card p-3">
                                        <p className="text-gray-400 text-xs mb-1">Carat Weight</p>
                                        <p className="font-medium text-gray-700">{product.caratWeight} ct</p>
                                    </div>
                                )}
                                <div className="glass-card p-3">
                                    <p className="text-gray-400 text-xs mb-1">Availability</p>
                                    <p className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                                    </p>
                                </div>
                                <div className="glass-card p-3">
                                    <p className="text-gray-400 text-xs mb-1">Added</p>
                                    <p className="font-medium text-gray-700">{formatDate(product.createdAt)}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <h3 className="text-lg font-serif font-semibold text-gray-800 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Tags */}
                            {product.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {product.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-500
                      text-xs rounded-full capitalize">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Info Notice */}
                            <div className="flex items-start gap-3 p-4 bg-primary-50/50 rounded-xl mt-6">
                                <FiInfo className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium text-gray-700 mb-1">Price Note</p>
                                    <p>Prices are calculated based on live Indian market rates and may vary.
                                        Visit our showroom for the most accurate pricing.</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <ReviewSection
                            productId={product._id}
                            reviews={reviews}
                            onReviewAdded={fetchProduct}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
