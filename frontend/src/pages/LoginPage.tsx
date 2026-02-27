import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const mutation = useMutation({
        mutationFn: () => isLogin ? authApi.login(email, password) : authApi.register(name, email, password),
        onSuccess: ({ token, isAdmin }) => {
            setAuth(token, isAdmin);
            toast.success(isLogin ? 'Welcome back! 🔪' : 'Account created! Welcome! 🔪');
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.error || (isLogin ? 'Incorrect email or password' : 'Error creating account');
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
                    Skip
                </button>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-sm animate-fade-in mt-12 bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-black/10 mx-auto">
                {/* Logo & Intro */}
                <div className="text-center mb-8">
                    <img src="/logo-haatzil.jpeg" alt="האציל Logo" className="h-[60px] mx-auto mb-4 object-contain mix-blend-multiply" />
                    <h1 className="text-2xl font-black text-[#111] tracking-widest uppercase mt-4">Login or Sign up</h1>
                    <p className="text-[#666] text-xs mt-2 uppercase tracking-wide">Enter your credentials below</p>
                </div>

                <div className="flex bg-[#F8F9FA] rounded-lg p-1 gap-1 mb-6 border border-black/5">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/30' : 'text-[#666] hover:text-[#111]'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/30' : 'text-[#666] hover:text-[#111]'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
                    className="space-y-4"
                    aria-labelledby="login-heading"
                >

                    {!isLogin && (
                        <div>
                            <input
                                id="user-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-[#F8F9FA] border border-black/10 rounded-xl px-4 py-3 text-[#111] placeholder-black/30 focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] outline-none transition-all text-sm"
                                dir="ltr"
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div>
                        <input
                            id="user-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email / Mobile Number"
                            className="w-full bg-[#F8F9FA] border border-black/10 rounded-xl px-4 py-3 text-[#111] placeholder-black/30 focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] outline-none transition-all text-sm"
                            dir="ltr"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                id="user-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-[#F8F9FA] border border-black/10 rounded-xl px-4 py-3 text-[#111] placeholder-black/30 focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] outline-none transition-all text-sm pr-12"
                                dir="ltr"
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#111] transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full justify-center py-3 mt-8 bg-[#C8102E] text-white font-black rounded-xl hover:bg-[#A00D24] hover:shadow-lg hover:shadow-[#C8102E]/40 transition-all uppercase tracking-widest text-sm"
                    >
                        {mutation.isPending ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
}
