import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI } from '../../services/api';
import { formatPrice, getMetalTypeName } from '../../utils/helpers';
import { FiEdit, FiTrash2, FiEye, FiEyeOff, FiPlus, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 15 };
            if (search) params.search = search;
            if (category) params.category = category;
            const res = await productAPI.adminGetAll(params);
            setProducts(res.data.data || []);
            setPagination(res.data.pagination || {});
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, category]);

    const handleToggle = async (id) => {
        try {
            await productAPI.toggle(id);
            toast.success('Product status updated');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to toggle product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await productAPI.delete(id);
            toast.success('Product deleted');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-serif font-bold text-gray-800">Products</h1>
                <Link
                    to="/admin/products/new"
                    className="btn-primary text-sm flex items-center gap-2"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search products..."
                        className="input-luxury pl-10 py-2.5 text-sm"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="input-luxury py-2.5 text-sm w-auto"
                >
                    <option value="">All Categories</option>
                    {['Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal'].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="spinner" /></div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-primary-50/50 border-b border-primary-100/50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metal</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-50">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-primary-50/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                                            {product.metalType} ({product.purity})
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                            {formatPrice(product.priceInfo?.totalPrice)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full
                        ${product.stockQuantity <= 5
                                                    ? product.stockQuantity === 0
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-amber-100 text-amber-600'
                                                    : 'bg-green-100 text-green-600'
                                                }`}>
                                                {product.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleToggle(product._id)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
                          ${product.isEnabled
                                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {product.isEnabled ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No products found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
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

export default AdminProducts;
