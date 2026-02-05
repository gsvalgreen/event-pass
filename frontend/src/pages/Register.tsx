import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        try {
            const { data } = await api.post('/auth/register', formData);
            login(data.token, data.user);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-dark-card p-8 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
            {error && <div className="bg-danger/20 text-danger border border-danger/50 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Name</label>
                    <input
                        type="text"
                        className="w-full bg-dark-input border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Email</label>
                    <input
                        type="email"
                        className="w-full bg-dark-input border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Password</label>
                    <input
                        type="password"
                        className="w-full bg-dark-input border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 rounded transition-colors"
                >
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-center text-gray-400 text-sm">
                Already have an account? <Link to="/login" className="text-secondary hover:text-white">Login</Link>
            </p>
        </div>
    );
};
