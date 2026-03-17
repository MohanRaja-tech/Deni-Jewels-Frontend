import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Load guest wishlist from localStorage on mount
    useEffect(() => {
        if (!isAuthenticated) {
            const savedLocal = localStorage.getItem('guest_wishlist');
            if (savedLocal) {
                try {
                    const ids = JSON.parse(savedLocal);
                    setWishlistIds(new Set(ids));
                } catch (e) {
                    console.error('Error parsing guest wishlist', e);
                }
            }
        }
    }, [isAuthenticated]);

    // Save guest wishlist to localStorage whenever it changes
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('guest_wishlist', JSON.stringify([...wishlistIds]));
        }
    }, [wishlistIds, isAuthenticated]);

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            const savedLocal = localStorage.getItem('guest_wishlist');
            if (!savedLocal) {
                setWishlist([]);
                return;
            }
            try {
                setLoading(true);
                const ids = JSON.parse(savedLocal);
                if (ids.length === 0) {
                    setWishlist([]);
                    return;
                }
                const res = await wishlistAPI.getGuestProducts(ids.join(','));
                setWishlist(res.data.data || []);
                setWishlistIds(new Set(ids));
            } catch (error) {
                console.error('Error fetching guest wishlist products:', error);
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            setLoading(true);
            const res = await wishlistAPI.get();
            const items = res.data.data || [];
            setWishlist(items);
            setWishlistIds(new Set(items.map((item) => item._id || item)));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Sync guest wishlist to database on login
    useEffect(() => {
        const syncGuestWishlist = async () => {
            if (isAuthenticated) {
                const savedLocal = localStorage.getItem('guest_wishlist');
                if (savedLocal) {
                    try {
                        const ids = JSON.parse(savedLocal);
                        if (ids.length > 0) {
                            await wishlistAPI.sync(ids);
                            localStorage.removeItem('guest_wishlist');
                            toast.success('Your guest wishlist has been synced! ✨');
                            await fetchWishlist();
                        }
                    } catch (e) {
                        console.error('Error syncing wishlist:', e);
                    }
                }
            }
        };
        syncGuestWishlist();
    }, [isAuthenticated, fetchWishlist]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!isAuthenticated) {
            setWishlistIds((prev) => {
                const newSet = new Set(prev);
                newSet.add(productId);
                localStorage.setItem('guest_wishlist', JSON.stringify([...newSet]));
                setTimeout(() => fetchWishlist(), 0);
                return newSet;
            });
            toast.success('Added to guest wishlist ✨');
            return true;
        }

        try {
            await wishlistAPI.add(productId);
            setWishlistIds((prev) => new Set([...prev, productId]));
            toast.success('Added to wishlist ✨');
            await fetchWishlist();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) {
            setWishlistIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                localStorage.setItem('guest_wishlist', JSON.stringify([...newSet]));
                setTimeout(() => fetchWishlist(), 0);
                return newSet;
            });
            toast.success('Removed from guest wishlist');
            return true;
        }

        try {
            await wishlistAPI.remove(productId);
            setWishlistIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
            toast.success('Removed from wishlist');
            await fetchWishlist();
            return true;
        } catch (error) {
            toast.error('Failed to remove from wishlist');
            return false;
        }
    };

    const isInWishlist = (productId) => wishlistIds.has(productId);

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            return await removeFromWishlist(productId);
        } else {
            return await addToWishlist(productId);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist, wishlistIds, loading,
            addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, fetchWishlist,
            wishlistCount: wishlistIds.size
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};

export default WishlistContext;
