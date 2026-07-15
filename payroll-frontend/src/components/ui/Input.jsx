import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</label>}
            <input
                className={`w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 transition-all ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        </div>
    );
}