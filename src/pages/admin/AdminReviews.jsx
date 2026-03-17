import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reviewAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { FiCheck, FiTrash2, FiStar, FiFilter } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 20 };
            if (status) params.status = status;
            const res = await reviewAPI.adminGetAll(params);
            setReviews(res.data.data || []);
            setPagination(res.data.pagination || {});
        } catch (error) {
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page, status]);

    const handleApprove = async (id) => {
        try {
            await reviewAPI.approve(id);
            toast.success('Review approved');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to approve review');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await reviewAPI.delete(id);
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-serif font-bold text-gray-800">Reviews</h1>
                <div className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4 text-gray-400" />
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="input-luxury py-2 text-sm w-auto"
                    >
                        <option value="">All Reviews</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="spinner" /></div>
            ) : reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-5"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <HiStar
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                      ${review.isApproved
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {review.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">{review.comment}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span>By: <span className="text-gray-600">{review.user?.name || 'Unknown'}</span></span>
                                        <span>•</span>
                                        <span>Product: <span className="text-gray-600">{review.product?.name || 'Unknown'}</span></span>
                                        <span>•</span>
                                        <span>{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!review.isApproved && (
                                        <button
                                            onClick={() => handleApprove(review._id)}
                                            className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-600
                        rounded-lg text-sm hover:bg-green-200 transition-colors"
                                        >
                                            <FiCheck className="w-4 h-4" />
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500
                      rounded-lg text-sm hover:bg-red-100 transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <FiStar className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                    <p className="text-gray-400">No reviews found</p>
                </div>
            )}

            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-8 h-8 rounded-full text-xs font-medium transition-all
                ${page === i + 1
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-gray-500 hover:bg-primary-50 border border-primary-100'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
