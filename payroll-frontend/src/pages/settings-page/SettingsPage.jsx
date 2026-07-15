import React from 'react';
import { Sliders, Shield, Bell, HardDrive } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">System Settings</h1>
                <p className="text-sm text-slate-500 mt-1">Configure global application parameters and multi-tenant isolation policies.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">

                {/* Section 1 */}
                <div className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <Sliders className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-md font-bold text-slate-800">Tenant Configuration</h3>
                        <p className="text-sm text-slate-400 mt-0.5">Enforce database routing rules and metadata mapping structures.</p>
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-600 inline-block">
                            TENANT_ISOLATION_MODE = DATABASE_ROW_LEVEL
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-md font-bold text-slate-800">Security & Cors Rules</h3>
                        <p className="text-sm text-slate-400 mt-0.5">Authorized backend endpoints allowed to perform state changes.</p>
                        <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            Spring Boot API connected on port 8080
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}