import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1F1F1F',
                        color: '#FFFFFF',
                        border: '1px solid rgba(200,16,46,0.4)',
                        fontFamily: 'Heebo, system-ui, sans-serif',
                        direction: 'rtl',
                    },
                    success: { iconTheme: { primary: '#C8102E', secondary: '#fff' } },
                }}
            />
        </QueryClientProvider>
    </React.StrictMode>
);
