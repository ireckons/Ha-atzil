import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { authApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const mutation = useMutation({
        mutationFn: (credential: string) => authApi.googleLogin(credential),
        onSuccess: ({ token, isAdmin }) => {
            setAuth(token, isAdmin);
            toast.success('Admin Login Successful! 🥩');
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.error || 'Login failed. Please make sure your email is authorized.';
            toast.error(msg);
        },
    });

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: 'url(/images/premium_cuts.jpg)' }}
            />
            <div className="absolute inset-0 z-0 bg-[#F8F9FA]/80" /> {/* Dimming overlay */}

            {/* Skip Button */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-1.5 bg-black/50 backdrop-blur-md text-white font-bold rounded-full text-xs hover:bg-[#C8102E] transition-colors border border-white/20"
                >
                    Go Back
                </button>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-sm animate-fade-in mt-12 bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-black/10 mx-auto">
                {/* Logo & Intro */}
                <div className="text-center mb-8">
                    <img src="/logo-haatzil.jpeg" alt="האציל Logo" className="h-[60px] mx-auto mb-4 object-contain mix-blend-multiply" />
                    <h1 className="text-2xl font-black text-[#111] tracking-widest uppercase mt-4">Admin Access</h1>
                    <p className="text-[#666] text-xs mt-2 uppercase tracking-wide">Sign in with Google to continue</p>
                </div>

                <div className="flex justify-center items-center py-8">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                mutation.mutate(credentialResponse.credential);
                            }
                        }}
                        onError={() => {
                            toast.error('Google Sign-In Failed');
                        }}
                        useOneTap
                        theme="filled_black"
                        shape="pill"
                    />
                </div>
            </div>
        </div>
    );
}
