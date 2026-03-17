import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI } from '../../services/api';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const categories = ['Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal'];
const metalTypes = ['gold', 'silver', 'platinum', 'diamond'];
const purities = {
    gold: ['22K', '24K', '18K', '14K'],
    silver: ['925', '999'],
    platinum: ['950', '999'],
    diamond: ['VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'],
};

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '', description: '', category: 'Rings', metalType: 'gold',
        purity: '22K', weight: '', caratWeight: '', makingCharge: '',
        gstPercentage: '3', stockQuantity: '1', tags: '',
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const res = await productAPI.getById(id);
                    const product = res.data.data;
                    setFormData({
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        metalType: product.metalType,
                        purity: product.purity,
                        weight: product.weight.toString(),
                        caratWeight: product.caratWeight?.toString() || '',
                        makingCharge: product.makingCharge.toString(),
                        gstPercentage: product.gstPercentage?.toString() || '3',
                        stockQuantity: product.stockQuantity.toString(),
                        tags: product.tags?.join(', ') || '',
                    });
                    setExistingImages(product.images || []);
                } catch (error) {
                    toast.error('Failed to fetch product');
                    navigate('/admin/products');
                } finally {
                    setFetching(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            // Reset purity when metal type changes
            if (name === 'metalType') {
                updated.purity = purities[value]?.[0] || '';
            }
            return updated;
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingImages.length + images.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }
        setImages((prev) => [...prev, ...files]);
    };

    const removeNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (index) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await productAPI.deleteImage(id, index);
            setExistingImages((prev) => prev.filter((_, i) => i !== index));
            toast.success('Image deleted');
        } catch (error) {
            toast.error('Failed to delete image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.weight || !formData.makingCharge) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!isEdit && images.length === 0 && existingImages.length === 0) {
            toast.error('Please add at least one image');
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) data.append(key, formData[key]);
            });

            images.forEach((img) => {
                data.append('images', img);
            });

            if (isEdit) {
                await productAPI.update(id, data);
                toast.success('Product updated! ✨');
            } else {
                await productAPI.create(data);
                toast.success('Product created! ✨');
            }

            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex justify-center py-12"><div className="spinner" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Product Name *</label>
                                    <input name="name" value={formData.name} onChange={handleChange}
                                        className="input-luxury" placeholder="e.g., Royal Heritage Necklace" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Description *</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange}
                                        rows={4} className="input-luxury resize-none"
                                        placeholder="Describe the product in detail..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Category *</label>
                                        <select name="category" value={formData.category} onChange={handleChange}
                                            className="input-luxury">
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Tags</label>
                                        <input name="tags" value={formData.tags} onChange={handleChange}
                                            className="input-luxury" placeholder="heritage, bridal, modern" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metal & Pricing */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Metal & Pricing</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Metal Type *</label>
                                    <select name="metalType" value={formData.metalType} onChange={handleChange}
                                        className="input-luxury">
                                        {metalTypes.map((type) => (
                                            <option key={type} value={type} className="capitalize">{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Purity *</label>
                                    <select name="purity" value={formData.purity} onChange={handleChange}
                                        className="input-luxury">
                                        {(purities[formData.metalType] || []).map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Weight (grams) *</label>
                                    <input name="weight" type="number" step="0.01" value={formData.weight}
                                        onChange={handleChange} className="input-luxury" placeholder="e.g., 12.5" />
                                </div>
                                {formData.metalType === 'diamond' && (
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Carat Weight</label>
                                        <input name="caratWeight" type="number" step="0.01" value={formData.caratWeight}
                                            onChange={handleChange} className="input-luxury" placeholder="e.g., 1.5" />
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Making Charge (₹) *</label>
                                    <input name="makingCharge" type="number" value={formData.makingCharge}
                                        onChange={handleChange} className="input-luxury" placeholder="e.g., 5000" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">GST %</label>
                                    <input name="gstPercentage" type="number" step="0.1" value={formData.gstPercentage}
                                        onChange={handleChange} className="input-luxury" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 mb-1 block">Stock Quantity *</label>
                                    <input name="stockQuantity" type="number" value={formData.stockQuantity}
                                        onChange={handleChange} className="input-luxury" placeholder="e.g., 10" />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img src={img.url} alt="" className="w-full aspect-square object-cover rounded-xl" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(i)}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full
                          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Images Preview */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img src={URL.createObjectURL(img)} alt=""
                                                className="w-full aspect-square object-cover rounded-xl border-2 border-dashed border-primary-300" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full
                          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <label className="flex items-center justify-center gap-2 px-6 py-8 border-2 border-dashed
                border-primary-200 rounded-xl cursor-pointer hover:border-primary-400
                hover:bg-primary-50/30 transition-all text-gray-400 hover:text-primary-500">
                                <FiUpload className="w-5 h-5" />
                                <span className="text-sm">Click to upload images (max 10)</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange}
                                    className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 sticky top-28">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Publish</h2>
                            <div className="space-y-3 mb-6 text-sm text-gray-500">
                                <p>• Price is calculated automatically from live rates</p>
                                <p>• Images will be uploaded to Cloudinary</p>
                                <p>• Product will be enabled by default</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <FiSave className="w-4 h-4" />
                                {loading
                                    ? (isEdit ? 'Updating...' : 'Creating...')
                                    : (isEdit ? 'Update Product' : 'Create Product')
                                }
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
