import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Pages
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminReviews from './pages/admin/AdminReviews';
import AdminHomeMedia from './pages/admin/AdminHomeMedia';
import AdminReports from './pages/admin/AdminReports';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loading />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    if (loading) return <Loading />;
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Layout wrapper that shows/hides Navbar/Footer based on route
const AppLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Protected User Routes */}
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/new" element={<ProductForm />} />
                            <Route path="products/edit/:id" element={<ProductForm />} />
                            <Route path="reviews" element={<AdminReviews />} />
                            <Route path="home-media" element={<AdminHomeMedia />} />
                            <Route path="reports" element={<AdminReports />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={
                            <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-warm-white">
                                <h1 className="text-6xl font-serif font-bold gold-text mb-4">404</h1>
                                <p className="text-gray-500 mb-6">Page not found</p>
                                <a href="/" className="btn-primary">Go Home</a>
                            </div>
                        } />
                    </Routes>
                </AnimatePresence>
            </main>
            {!isAdminRoute && <Footer />}
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <WishlistProvider>
                    <AppLayout />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#FFF',
                                color: '#333',
                                borderRadius: '12px',
                                border: '1px solid rgba(212, 168, 83, 0.2)',
                                boxShadow: '0 4px 30px rgba(212, 168, 83, 0.1)',
                                fontSize: '14px',
                            },
                            success: {
                                iconTheme: { primary: '#D4A853', secondary: '#FFF' },
                            },
                        }}
                    />
                </WishlistProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
