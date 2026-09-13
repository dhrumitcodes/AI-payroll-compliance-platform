import React from "react";
import {
    SlidersHorizontal,
    ShieldCheck,
    Bell,
    Database,
    Server,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";

const settingsSections = [
    {
        icon: SlidersHorizontal,
        title: "Tenant Configuration",
        description:
            "Database routing and isolation policies used across tenant workspaces.",
        iconStyle:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        content: (
            <div className="mt-5">
                <div
                    className="
                        inline-flex
                        items-center
                        rounded-md
                        border
                        border-slate-200
                        dark:border-slate-700
                        bg-slate-50
                        dark:bg-slate-900
                        px-3
                        py-2
                    "
                >
                    <code
                        className="
                            text-xs
                            font-mono
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        TENANT_ISOLATION_MODE
                        <span className="mx-2 text-slate-400">=</span>
                        DATABASE_ROW_LEVEL
                    </code>
                </div>
            </div>
        ),
    },
    {
        icon: ShieldCheck,
        title: "Security & Access",
        description:
            "Application security policies and authorized backend access.",
        iconStyle:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        content: (
            <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <span
                        className="
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-50
                            dark:bg-emerald-950/50
                        "
                    >
                        <CheckCircle2
                            className="h-3.5 w-3.5 text-emerald-600"
                        />
                    </span>

                    <span className="text-slate-600 dark:text-slate-300">
                        Spring Boot API connected
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <Server className="h-3.5 w-3.5" />
                    <span>Backend service · Port 8080</span>
                </div>
            </div>
        ),
    },
    {
        icon: Bell,
        title: "Notifications",
        description:
            "System notifications and compliance-related alerts.",
        iconStyle:
            "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        content: (
            <div className="mt-5">
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-md
                        border
                        border-slate-200
                        dark:border-slate-700
                        px-4
                        py-3
                    "
                >
                    <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Compliance alerts
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            Notification preferences are managed by the system.
                        </p>
                    </div>

                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-medium
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        System managed
                    </span>
                </div>
            </div>
        ),
    },
    {
        icon: Database,
        title: "Data & Infrastructure",
        description:
            "Application data services and persistence infrastructure.",
        iconStyle:
            "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        content: (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                    className="
                        rounded-md
                        border
                        border-slate-200
                        dark:border-slate-700
                        px-4
                        py-3
                    "
                >
                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            "
                        />

                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Database
                        </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Connected
                    </p>
                </div>

                <div
                    className="
                        rounded-md
                        border
                        border-slate-200
                        dark:border-slate-700
                        px-4
                        py-3
                    "
                >
                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            "
                        />

                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            API Service
                        </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Operational
                    </p>
                </div>
            </div>
        ),
    },
];

export default function SettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.14em]
                            font-medium
                            text-accent
                        "
                    >
                        Administration
                    </span>
                </div>

                <h1
                    className="
                        text-2xl
                        font-semibold
                        tracking-[-0.02em]
                        text-slate-900
                        dark:text-slate-100
                    "
                >
                    System Settings
                </h1>

                <p
                    className="
                        mt-1.5
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Configure and monitor global application parameters,
                    security, and infrastructure.
                </p>
            </div>

            <div
                className="
                    overflow-hidden
                    rounded-lg
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                "
            >
                {settingsSections.map(
                    (
                        {
                            icon: Icon,
                            title,
                            description,
                            iconStyle,
                            content,
                        },
                        index
                    ) => (
                        <section
                            key={title}
                            className={`
                                px-6
                                py-6
                                sm:px-7
                                ${
                                index !==
                                settingsSections.length - 1
                                    ? "border-b border-slate-200 dark:border-slate-800"
                                    : ""
                            }
                            `}
                        >
                            <div className="flex items-start gap-4">

                                <div
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        ${iconStyle}
                                    `}
                                >
                                    <Icon
                                        className="h-5 w-5"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-900
                                                    dark:text-slate-100
                                                "
                                            >
                                                {title}
                                            </h2>

                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    leading-5
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                {description}
                                            </p>
                                        </div>

                                        <ChevronRight
                                            className="
                                                hidden
                                                sm:block
                                                h-4
                                                w-4
                                                shrink-0
                                                text-slate-300
                                                dark:text-slate-600
                                            "
                                        />
                                    </div>

                                    {content}
                                </div>
                            </div>
                        </section>
                    )
                )}
            </div>

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-lg
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                    px-5
                    py-4
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-50
                            dark:bg-emerald-950/40
                        "
                    >
                        <CheckCircle2
                            className="
                                h-4
                                w-4
                                text-emerald-600
                                dark:text-emerald-400
                            "
                        />
                    </div>

                    <div>
                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-800
                                dark:text-slate-200
                            "
                        >
                            All systems operational
                        </p>

                        <p
                            className="
                                text-xs
                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            Quillcrest services are running normally.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        hidden
                        sm:block
                        text-[10px]
                        uppercase
                        tracking-wider
                        text-slate-400
                        dark:text-slate-500
                    "
                >
                    System status
                </span>
            </div>
        </div>
    );
}