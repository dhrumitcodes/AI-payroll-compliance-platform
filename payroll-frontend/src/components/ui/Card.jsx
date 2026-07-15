import React from 'react';

export default function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm dark:bg-slate-950 dark:border-slate-900 ${className}`}>
            {children}
        </div>
    );
}