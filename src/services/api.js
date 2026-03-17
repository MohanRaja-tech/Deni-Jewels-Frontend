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
            if (window.location.pathname \!== '/login' && window.location.pathname \!== '/admin/login') {
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
