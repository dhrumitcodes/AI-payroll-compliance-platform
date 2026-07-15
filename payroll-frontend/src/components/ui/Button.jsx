import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyles = 'px-4 py-2 text-sm font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm shadow-indigo-500/10',
        secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850',
        danger: 'bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}