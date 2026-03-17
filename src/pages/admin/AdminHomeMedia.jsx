import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { homeMediaAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2, FiEye, FiEyeOff, FiVideo, FiImage, FiPlus } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const AdminHomeMedia = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [title, setTitle] = useState('');
    const fileInputRef = useRef();

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await homeMediaAPI.adminGetAll();
            setMediaList(res.data.data || []);
        } catch {
            toast.error('Failed to load media');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedia(); }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            toast.error('Please select an image or video file');
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            toast.error('File size must be under 50MB');
            return;
        }

        setPreviewType(isVideo ? 'video' : 'image');
        setPreview({ file, url: URL.createObjectURL(file) });
    };

    const handleUpload = async () => {
        if (!preview?.file) {
            toast.error('Please select a file first');
            return;
        }
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('media', preview.file);
            if (title) formData.append('title', title);

            await homeMediaAPI.upload(formData);
            toast.success('Media uploaded successfully! ✨');
            setPreview(null);
            setPreviewType(null);
            setTitle('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchMedia();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await homeMediaAPI.toggle(id);
            toast.success('Visibility updated');
            fetchMedia();
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this media? This will remove it from the home page.')) return;
        try {
            await homeMediaAPI.delete(id);
            toast.success('Media deleted');
            fetchMedia();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const cancelPreview = () => {
        setPreview(null);
        setPreviewType(null);
        setTitle('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <HiOutlineSparkles className="w-6 h-6 text-primary-500" />
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Home Page Media</h1>
                </div>
                <p className="text-gray-500 text-sm">
                    Upload a video or image that will be displayed on the home page hero section.
                    The most recently <span className="text-green-600 font-medium">active</span> media will be shown.
                </p>
            </div>

            {/* Upload Section */}
            <div className="glass-card p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiPlus className="w-5 h-5 text-primary-500" /> Upload New Media
                </h2>

                {!preview ? (
                    <label
                        htmlFor="home-media-upload"
                        className="flex flex-col items-center justify-center gap-3 p-12 border-2 border-dashed
                            border-primary-200 rounded-2xl cursor-pointer hover:border-primary-400
                            hover:bg-primary-50/30 transition-all text-center"
                    >
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center">
                                <FiVideo className="w-7 h-7 text-primary-500" />
                            </div>
                            <div className="w-14 h-14 bg-champagne/50 rounded-full flex items-center justify-center">
                                <FiImage className="w-7 h-7 text-primary-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-gray-700">Click to upload video or image</p>
                            <p className="text-sm text-gray-400 mt-1">MP4, MOV, WebM, JPG, PNG, WebP — Max 50MB</p>
                        </div>
                        <input
                            id="home-media-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="space-y-4">
                        {/* Preview */}
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-80 border-2 border-primary-200">
                            {previewType === 'video' ? (
                                <video
                                    src={preview.url}
                                    className="w-full h-full object-contain"
                                    controls
                                    autoPlay
                                    muted
                                />
                            ) : (
                                <img
                                    src={preview.url}
                                    className="w-full h-full object-contain"
                                    alt="Preview"
                                />
                            )}
                            <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${previewType === 'video' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                    {previewType === 'video' ? '🎬 Video' : '🖼️ Image'}
                                </span>
                            </div>
                        </div>

                        {/* Title input */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Optional title (e.g. Summer Collection 2024)"
                            className="input-luxury w-full"
                        />

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn-primary flex items-center gap-2 flex-1 justify-center"
                            >
                                {uploading ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                ) : (
                                    <><FiUpload className="w-4 h-4" /> Upload to Home Page</>
                                )}
                            </button>
                            <button
                                onClick={cancelPreview}
                                className="btn-outline px-6"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Media Library */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Media Library</h2>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : mediaList.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">🎬</p>
                        <p className="text-gray-500">No media uploaded yet</p>
                        <p className="text-gray-400 text-sm mt-1">Upload a video or image above to display it on the home page</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {mediaList.map((item) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${item.isActive ? 'border-green-400 shadow-lg' : 'border-gray-200 opacity-60'}`}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-black">
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.url}
                                                className="w-full h-full object-cover"
                                                muted
                                                onMouseEnter={e => e.target.play()}
                                                onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                                            />
                                        ) : (
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>

                                    {/* Active badge */}
                                    {item.isActive && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            ✓ Active on Home
                                        </div>
                                    )}

                                    {/* Type badge */}
                                    <div className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${item.type === 'video' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                        {item.type === 'video' ? '🎬 Video' : '🖼️ Image'}
                                    </div>

                                    {/* Info & Actions */}
                                    <div className="p-4 bg-white">
                                        <p className="text-sm font-semibold text-gray-800 truncate mb-1">{item.title}</p>
                                        <p className="text-xs text-gray-400 mb-3">
                                            {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggle(item._id)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${item.isActive ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                            >
                                                {item.isActive ? <><FiEyeOff className="w-3.5 h-3.5" /> Hide</> : <><FiEye className="w-3.5 h-3.5" /> Show</>}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                                            >
                                                <FiTrash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHomeMedia;
