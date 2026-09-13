import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    AlertCircle,
    BarChart3,
    FileText,
    ShieldCheck,
} from "lucide-react";
import WaveBackground from "../../components/ui/WaveBackground";

const API_BASE = "http://localhost:8080/api";

const features = [
    {
        icon: BarChart3,
        label: "Automated tax calculation",
    },
    {
        icon: FileText,
        label: "Audit-ready record keeping",
    },
    {
        icon: ShieldCheck,
        label: "Role-based access control",
    },
];

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password"
                );
            }

            // Store JWT token
            localStorage.setItem("token", data.token);

            // Store logged-in user's email
            if (data.email) {
                localStorage.setItem("userEmail", data.email);
            }

            // Store user's role
            if (data.role) {
                localStorage.setItem("userRole", data.role);
            }

            // Store company ID
            if (
                data.companyId !== undefined &&
                data.companyId !== null
            ) {
                localStorage.setItem(
                    "companyId",
                    String(data.companyId)
                );
            }

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.message ||
                "Failed to connect to backend server"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#0b0b0d]
                text-[#f1f1ef]
            "
        >
            <WaveBackground />

            <div
                className="
                    relative
                    z-10
                    grid
                    min-h-screen
                    lg:grid-cols-2
                "
            >
                <section
                    className="
                        hidden
                        lg:flex
                        flex-col
                        justify-between
                        p-14
                        xl:p-16
                    "
                >
                    <div className="flex items-center">
                        <div className="flex items-center gap-3">
                            {/* Q MARK */}

                            <div
                                className="
                                    relative
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/30
                                "
                            >
                                <span
                                    className="
                                        text-[19px]
                                        leading-none
                                        text-[#f1f1ef]
                                    "
                                    style={{
                                        fontFamily:
                                            'Georgia, "Times New Roman", serif',
                                        fontWeight: 500,
                                    }}
                                >
                                    Q
                                </span>

                                <span
                                    className="
                                        absolute
                                        -right-1
                                        bottom-[3px]
                                        h-3
                                        w-2.5
                                        rotate-[-22deg]
                                        border-b
                                        border-r
                                        border-white/45
                                    "
                                />
                            </div>

                            <div className="flex flex-col">
                                <span
                                    className="
                                        text-[18px]
                                        leading-none
                                        tracking-[0.14em]
                                        text-[#f1f1ef]
                                    "
                                    style={{
                                        fontFamily:
                                            'Georgia, "Times New Roman", serif',
                                        fontWeight: 600,
                                    }}
                                >
                                    QUILLCREST
                                </span>

                                <span
                                    className="
                                        mt-1
                                        text-[8px]
                                        leading-none
                                        tracking-[0.22em]
                                        text-[#a7a7ac]
                                    "
                                >
                                    PAYROLL • COMPLIANCE
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <div
                            className="
                                mb-6
                                h-px
                                w-12
                                bg-white/30
                            "
                        />

                        <h1
                            className="
                                text-[31px]
                                leading-[1.18]
                                tracking-[-0.02em]
                                text-[#f1f1ef]
                                xl:text-[34px]
                            "
                            style={{
                                fontFamily:
                                    'Georgia, "Times New Roman", serif',
                                fontWeight: 400,
                            }}
                        >
                            Payroll and compliance,
                            <br />
                            handled with precision.
                        </h1>

                        <p
                            className="
                                mt-5
                                max-w-md
                                text-[15px]
                                leading-7
                                text-[#a7a7ac]
                            "
                        >
                            Multi-tenant payroll processing with
                            real-time statutory compliance tracking.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {features.map(
                            ({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="
                                        flex
                                        items-center
                                        gap-3.5
                                        text-sm
                                        text-[#a7a7ac]
                                    "
                                >
                                    <Icon
                                        className="
                                            h-[17px]
                                            w-[17px]
                                            shrink-0
                                            text-white/65
                                        "
                                        strokeWidth={1.6}
                                    />

                                    <span>{label}</span>
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section
                    className="
                        flex
                        min-h-screen
                        items-center
                        justify-center
                        p-6
                        lg:p-14
                    "
                >
                    <div className="w-full max-w-md">
                        <div
                            className="
                                rounded-[8px]
                                border
                                border-white/[0.09]
                                bg-[#141518]
                                p-8
                                shadow-[0_24px_70px_rgba(0,0,0,0.35)]
                                sm:p-10
                            "
                        >
                            <div
                                className="
                                    mb-8
                                    flex
                                    items-center
                                    gap-2.5
                                    lg:hidden
                                "
                            >
                                <div
                                    className="
                                        relative
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/30
                                    "
                                >
                                    <span
                                        className="
                                            text-[17px]
                                            leading-none
                                            text-[#f1f1ef]
                                        "
                                        style={{
                                            fontFamily:
                                                'Georgia, "Times New Roman", serif',
                                        }}
                                    >
                                        Q
                                    </span>

                                    <span
                                        className="
                                            absolute
                                            -right-1
                                            bottom-0
                                            h-3
                                            w-3
                                            rotate-[-22deg]
                                            border-b
                                            border-r
                                            border-white/45
                                        "
                                    />
                                </div>

                                <div>
                                    <span
                                        className="
                                            block
                                            text-[14px]
                                            tracking-[0.16em]
                                            text-[#f1f1ef]
                                        "
                                        style={{
                                            fontFamily:
                                                'Georgia, "Times New Roman", serif',
                                            fontWeight: 600,
                                        }}
                                    >
                                        QUILLCREST
                                    </span>

                                    <span
                                        className="
                                            mt-1
                                            block
                                            text-[8px]
                                            tracking-[0.22em]
                                            text-[#a7a7ac]
                                        "
                                    >
                                        PAYROLL • COMPLIANCE
                                    </span>
                                </div>
                            </div>

                            <div className="mb-7">
                                <h2
                                    className="
                                        mb-1
                                        text-2xl
                                        font-semibold
                                        tracking-[-0.01em]
                                        text-[#f1f1ef]
                                    "
                                >
                                    Sign in
                                </h2>

                                <p
                                    className="
                                        text-sm
                                        text-[#a7a7ac]
                                    "
                                >
                                    Enter your workspace credentials
                                </p>
                            </div>

                            {error && (
                                <div
                                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-2
                                        rounded-[6px]
                                        border
                                        border-red-400/20
                                        bg-red-950/30
                                        p-3
                                        text-sm
                                        text-red-300
                                    "
                                >
                                    <AlertCircle
                                        className="
                                            mt-0.5
                                            h-4
                                            w-4
                                            shrink-0
                                        "
                                    />

                                    <span>{error}</span>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                autoComplete="off"
                            >
                                <div>
                                    <label
                                        className="
                                            mb-1.5
                                            block
                                            text-sm
                                            font-medium
                                            text-[#a7a7ac]
                                        "
                                    >
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        required
                                        autoComplete="off"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="name@company.com"
                                        className="
                                            w-full
                                            rounded-[6px]
                                            border
                                            border-white/10
                                            bg-white/[0.045]
                                            px-3.5
                                            py-2.5
                                            text-sm
                                            text-[#f1f1ef]
                                            placeholder:text-white/30
                                            focus:border-[#2b4c8c]
                                            focus:outline-none
                                            transition-colors
                                        "
                                    />
                                </div>

                                <div>
                                    <label
                                        className="
                                            mb-1.5
                                            block
                                            text-sm
                                            font-medium
                                            text-[#a7a7ac]
                                        "
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="
                                                w-full
                                                rounded-[6px]
                                                border
                                                border-white/10
                                                bg-white/[0.045]
                                                px-3.5
                                                py-2.5
                                                pr-10
                                                text-sm
                                                text-[#f1f1ef]
                                                placeholder:text-white/30
                                                focus:border-[#2b4c8c]
                                                focus:outline-none
                                                transition-colors
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (s) => !s
                                                )
                                            }
                                            className="
                                                absolute
                                                right-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-white/40
                                                transition-colors
                                                hover:text-white/80
                                            "
                                            tabIndex={-1}
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        mt-2
                                        w-full
                                        cursor-pointer
                                        rounded-[6px]
                                        bg-[#2b4c8c]
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition-colors
                                        hover:bg-[#223d72]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {loading
                                        ? "Signing in…"
                                        : "Sign in"}
                                </button>
                            </form>

                            <p
                                className="
                                    mt-6
                                    text-center
                                    text-xs
                                    text-white/30
                                "
                            >
                                Protected workspace access only
                            </p>
                        </div>

                        {/* PRODUCT DESCRIPTOR */}

                        <p
                            className="
                                mt-5
                                text-center
                                text-[10px]
                                tracking-[0.12em]
                                text-white/20
                            "
                        >
                            QUILLCREST · PAYROLL & COMPLIANCE
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}