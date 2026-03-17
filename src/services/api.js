import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/admin/login') {
                // Don't force redirect, let the auth context handle it
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    adminLogin: (data) => API.post('/auth/admin/login', data),
    getProfile: () => API.get('/auth/me'),
    updateProfile: (data) => API.put('/auth/profile', data),
    changePassword: (data) => API.put('/auth/password', data),
};

// Product API
export const productAPI = {
    getAll: (params) => API.get('/products', { params }),
    getById: (id) => API.get(`/products/${id}`),
    create: (data) => API.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, data) => API.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => API.delete(`/products/${id}`),
    deleteImage: (id, imageIndex) => API.delete(`/products/${id}/images/${imageIndex}`),
    toggle: (id) => API.patch(`/products/${id}/toggle`),
    adminGetAll: (params) => API.get('/products/admin/all', { params }),
    getStats: () => API.get('/products/admin/stats'),
};

// Review API
export const reviewAPI = {
    create: (data) => API.post('/reviews', data),
    getByProduct: (productId) => API.get(`/reviews/product/${productId}`),
    adminGetAll: (params) => API.get('/reviews/admin/all', { params }),
    approve: (id) => API.patch(`/reviews/${id}/approve`),
    delete: (id) => API.delete(`/reviews/${id}`),
    getStats: () => API.get('/reviews/admin/stats'),
};

// Wishlist API
export const wishlistAPI = {
    get: () => API.get('/wishlist'),
    add: (productId) => API.post(`/wishlist/${productId}`),
    remove: (productId) => API.delete(`/wishlist/${productId}`),
    check: (productId) => API.get(`/wishlist/check/${productId}`),
    getGuestProducts: (ids) => API.get(`/products?ids=${ids}&limit=100`),
    sync: (productIds) => API.post('/wishlist/sync', { productIds }),
};

// Rate API
export const rateAPI = {
    get: () => API.get('/rates'),
    refresh: () => API.post('/rates/refresh'),
};

// Home Media API
export const homeMediaAPI = {
    get: () => API.get('/home-media'),
    adminGetAll: () => API.get('/home-media/admin/all'),
    upload: (data) => API.post('/home-media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    toggle: (id) => API.patch(`/home-media/${id}/toggle`),
    delete: (id) => API.delete(`/home-media/${id}`),
};

// Report API
export const reportAPI = {
    generate: (type) => API.get('/reports/generate', { params: { type } }),
};

export default API;
