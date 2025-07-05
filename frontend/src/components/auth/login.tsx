import React, { useState } from 'react';
const URL = import.meta.env.VITE_API_URL;

interface User {
    username: string;
    email: string;
    _id: string;
}
interface LoginDialogProps {
    onClose: () => void;
    onRegister: () => void;
    onLoginSuccess: (user: User) => void;
}

export function LoginDialog({
    onClose,
    onRegister,
    onLoginSuccess
}: LoginDialogProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            // console.log('Login response:====', data);

            // Check if login is successful and required fields exist
            if (!res.ok || !data.user || !data.token) {
                throw new Error(data.message || 'Login failed');
            }

            // Save to localStorage properly
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token); // token is a string already
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            console.log('Username=====:', user?.username);
            onLoginSuccess(data.user); // You can also pass parsed user data if needed
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border rounded px-3 py-2"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                            placeholder="Enter your email"
                            title="Email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            title="Password"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={onRegister}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
