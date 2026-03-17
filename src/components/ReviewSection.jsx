import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { reviewAPI } from '../services/api';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const StarRating = ({ rating, setRating, interactive = false, size = 'md' }) => {
    const [hover, setHover] = useState(0);
    const sizeClass = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && setRating(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
                    disabled={!interactive}
                >
                    <HiStar
                        className={`${sizeClass} ${star <= (hover || rating) ? 'text-amber-400' : 'text-gray-200'
                            } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
};

const ReviewSection = ({ productId, reviews = [], onReviewAdded }) => {
    const { isAuthenticated, user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        try {
            setSubmitting(true);
            await reviewAPI.create({ productId, rating, comment });
            toast.success('Review submitted! It will be visible after admin approval.');
            setRating(0);
            setComment('');
            setShowForm(false);
            if (onReviewAdded) onReviewAdded();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                Customer Reviews
            </h3>

            {/* Review Form */}
            {isAuthenticated ? (
                <div className="mb-8">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-outline text-sm"
                        >
                            Write a Review
                        </button>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="glass-card p-6 mb-6"
                        >
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Review</h4>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Rating</label>
                                <StarRating rating={rating} setRating={setRating} interactive size="lg" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience with this piece..."
                                    rows={4}
                                    maxLength={500}
                                    className="input-luxury resize-none"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    {comment.length}/500
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary text-sm disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setRating(0); setComment(''); }}
                                    className="px-6 py-2 text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            ) : (
                <p className="text-sm text-gray-400 mb-6">
                    <a href="/login" className="text-primary-500 hover:underline">Login</a> to write a review
                </p>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-5"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-medium text-gray-800">
                                        {review.user?.name || 'Anonymous'}
                                    </h4>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <span className="text-xs text-gray-400">
                                    {formatDate(review.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mt-3">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
            )}
        </div>
    );
};

export { StarRating };
export default ReviewSection;
