import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Logging in with:", email, password);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-center text-white">
                    AI Payroll Platform
                </h1>

                <p className="text-slate-400 text-center mt-2">
                    Sign in to continue
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

            </div>
        </div>
    );
}

export default LoginPage;