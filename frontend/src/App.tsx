import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import WhatsAppButton from './components/WhatsAppButton';
import { useAuthStore } from './store/authStore';

const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const token = useAuthStore((s) => s.token);
    if (!token || !isAdmin) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-black">
            <div className="w-12 h-12 border-4 border-black/10 border-t-brand-red rounded-full animate-spin" aria-label="Loading..." />
        </div>
    );
}

export default function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <BrowserRouter>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        {/* General/Admin Login */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
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
                                <div dir="ltr" className="min-h-screen font-sans text-brand-white bg-brand-black overflow-x-hidden w-full pb-16 md:pb-0">
                                    <Navbar />
                                    <MobileBottomNav />
                                    <WhatsAppButton />
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
                                            <Route path="/terms" element={<TermsPage />} />
                                            <Route path="/accessibility" element={<AccessibilityPage />} />
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>
                                    </main>
                                </div>
                            }
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}
