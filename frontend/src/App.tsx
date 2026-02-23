import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';

const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const token = useAuthStore((s) => s.token);
    if (!token || !isAdmin) return <Navigate to="/admin/login" replace />;
    return <>{children}</>;
}

function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-black">
            <div className="w-12 h-12 border-4 border-brand-dark-gray border-t-brand-red rounded-full animate-spin" aria-label="טוען..." />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Admin routes – no main navbar */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Customer routes */}
                    <Route
                        path="*"
                        element={
                            <>
                                <Navbar />
                                <main>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/catalog" element={<CatalogPage />} />
                                        <Route path="/catalog/:category" element={<CatalogPage />} />
                                        <Route path="/product/:id" element={<ProductPage />} />
                                        <Route path="/cart" element={<CartPage />} />
                                        <Route path="/checkout" element={<CheckoutPage />} />
                                        <Route path="/confirmation" element={<ConfirmationPage />} />
                                        <Route path="/privacy" element={<PrivacyPage />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </main>
                            </>
                        }
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
