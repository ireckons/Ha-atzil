import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const mutation = useMutation({
        mutationFn: () => authApi.login(email, password),
        onSuccess: ({ token, isAdmin }) => {
            if (!isAdmin) { toast.error('אין הרשאות מנהל'); return; }
            setAuth(token, isAdmin);
            toast.success('ברוך הבא! 🔪');
            navigate('/admin');
        },
        onError: () => toast.error('אימייל או סיסמה שגויים'),
    });

    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-10">
                    <img src="/bull-silhouette.svg" alt="" className="w-16 h-16 mx-auto mb-4 opacity-80" aria-hidden="true" />
                    <h1 className="text-3xl font-black text-white font-hebrew">האציל</h1>
                    <p className="text-white/40 text-sm mt-1">ממשק ניהול</p>
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
                    className="card p-8 space-y-5"
                    aria-labelledby="login-heading"
                >
                    <h2 id="login-heading" className="text-xl font-bold text-white">כניסת מנהל</h2>

                    <div>
                        <label htmlFor="admin-email" className="block text-sm font-medium text-white/60 mb-1">אימייל</label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@haatzil.co.il"
                            className="input"
                            dir="ltr"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin-password" className="block text-sm font-medium text-white/60 mb-1">סיסמה</label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                style={{ paddingRight: '2.5rem', textAlign: 'left' }}
                                dir="ltr"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 flex items-center text-white/40 hover:text-white transition-colors"
                                style={{ right: '0.75rem' }}
                                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                        className="btn-primary w-full justify-center py-3"
                    >
                        {mutation.isPending ? 'מתחבר…' : 'כניסה'}
                    </button>
                </form>
            </div>
        </div>
    );
}
