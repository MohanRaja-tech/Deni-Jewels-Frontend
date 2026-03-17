import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const categories = ['All', 'Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal'];
const metalTypes = ['All', 'gold', 'silver', 'platinum', 'diamond'];
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A-Z' },
];

const Collections = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'All',
        metalType: searchParams.get('metalType') || 'All',
        search: searchParams.get('search') || '',
        sort: 'newest',
        page: 1,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = { page: filters.page, limit: 12, sort: filters.sort };
                if (filters.category !== 'All') params.category = filters.category;
                if (filters.metalType !== 'All') params.metalType = filters.metalType;
                if (filters.search) params.search = filters.search;

                const res = await productAPI.getAll(params);
                setProducts(res.data.data || []);
                setPagination(res.data.pagination || {});
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ category: 'All', metalType: 'All', search: '', sort: 'newest', page: 1 });
        setSearchParams({});
    };

    const hasActiveFilters = filters.category !== 'All' || filters.metalType !== 'All' || filters.search;

    return (
        <div className="min-h-screen pt-24 bg-warm-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-champagne/30 via-warm-white to-champagne/30 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="section-heading">
                            Our <span className="gold-text">Collections</span>
                        </h1>
                        <p className="section-subheading">
                            Explore our exquisite range of handcrafted jewellery pieces
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            placeholder="Search jewellery..."
                            className="input-luxury pl-11 py-2.5 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            className="input-luxury py-2.5 text-sm w-auto"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {/* Filter Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-primary-200
                rounded-xl text-sm text-gray-600 hover:bg-primary-50 transition-colors"
                        >
                            <FiFilter className="w-4 h-4" />
                            Filters
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <motion.aside
                        initial={false}
                        className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}
                    >
                        <div className="glass-card p-5 sticky top-28">
                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                                    Category
                                </h3>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => updateFilter('category', cat)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                        ${filters.category === cat
                                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                                    : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Metal Type */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                                    Metal Type
                                </h3>
                                <div className="space-y-1">
                                    {metalTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => updateFilter('metalType', type)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize
                        ${filters.metalType === type
                                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                                    : 'text-gray-500 hover:bg-primary-50 hover:text-primary-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <Loading text="Finding exquisite pieces..." />
                        ) : products.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-400 mb-6">
                                    Showing {products.length} of {pagination.total || 0} pieces
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex justify-center gap-2 mt-12">
                                        {[...Array(pagination.pages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
                                                className={`w-10 h-10 rounded-full text-sm font-medium transition-all
                          ${filters.page === i + 1
                                                        ? 'bg-primary-500 text-white shadow-luxury'
                                                        : 'bg-white text-gray-500 hover:bg-primary-50 border border-primary-100'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-5xl mb-4">✨</p>
                                <h3 className="text-xl font-serif text-gray-700 mb-2">No pieces found</h3>
                                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                                <button onClick={clearFilters} className="btn-outline text-sm">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collections;
