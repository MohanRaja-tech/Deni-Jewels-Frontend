import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
                try {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    // Verify token is still valid
                    const res = await authAPI.getProfile();
                    setUser(res.data.data);
                    localStorage.setItem('user', JSON.stringify(res.data.data));
                } catch (error) {
                    // Token expired or invalid
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token: newToken, ...userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const adminLogin = async (email, password) => {
        const res = await authAPI.adminLogin({ email, password });
        const { token: newToken, ...userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const register = async (data) => {
        const res = await authAPI.register(data);
        const { token: newToken, ...userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, adminLogin, register, logout, updateUser,
            isAuthenticated: !!token,
            isAdmin: user?.role === 'admin',
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
