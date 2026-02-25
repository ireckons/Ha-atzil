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
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{ backgroundImage: 'url(/images/premium_cuts.jpg)' }}
            />
            <div className="absolute inset-0 z-0 bg-brand-black/70" /> {/* Dimming overlay */}

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/bull-silhouette.svg" alt="" className="w-16 h-16 mx-auto mb-4 opacity-80" aria-hidden="true" />
                    <h1 className="text-3xl font-black text-white font-hebrew">האציל</h1>
                    <p className="text-white/40 text-sm mt-1">Premium Kosher Meats</p>
                </div>

                <div className="flex bg-white/5 rounded-t-lg p-1 gap-1 mb-2">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${isLogin ? 'bg-[#C8102E] text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${!isLogin ? 'bg-[#C8102E] text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
                    className="card p-8 space-y-5 rounded-t-none"
                    aria-labelledby="login-heading"
                >
                    <h2 id="login-heading" className="text-xl font-bold text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {!isLogin && (
                        <div>
                            <label htmlFor="user-name" className="block text-sm font-medium text-white/60 mb-1">Full Name</label>
                            <input
                                id="user-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="input"
                                dir="ltr"
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="user-email" className="block text-sm font-medium text-white/60 mb-1">Email</label>
                        <input
                            id="user-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="input"
                            dir="ltr"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label htmlFor="user-password" className="block text-sm font-medium text-white/60 mb-1">Password</label>
                        <div className="relative">
                            <input
                                id="user-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                style={{ paddingRight: '2.5rem', textAlign: 'left' }}
                                dir="ltr"
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 flex items-center text-white/40 hover:text-white transition-colors"
                                style={{ right: '0.75rem' }}
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
                        {!isLogin && <p className="text-white/30 text-[10px] mt-1">Must be at least 6 characters</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="btn-primary w-full justify-center py-3 mt-2"
                    >
                        {mutation.isPending ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
}
