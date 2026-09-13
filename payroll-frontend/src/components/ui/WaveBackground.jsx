import React, { useMemo } from "react";

export default function WaveBackground({ className = "" }) {
    const bandA = useMemo(
        () =>
            Array.from({ length: 18 }, (_, i) => {
                const y = 110 + i * 15;

                return `M -60 ${y}
                    C 100 ${y + 90},
                      260 ${y - 90},
                      420 ${y + 30}
                    S 700 ${y + 90},
                      900 ${y}`;
            }),
        []
    );

    const bandB = useMemo(
        () =>
            Array.from({ length: 16 }, (_, i) => {
                const y = 450 + i * 15;

                return `M -60 ${y}
                    C 100 ${y - 110},
                      260 ${y + 110},
                      420 ${y - 40}
                    S 700 ${y - 110},
                      900 ${y}`;
            }),
        []
    );

    return (
        <svg
            className={`absolute inset-0 w-full h-full ${className}`}
            viewBox="0 0 480 700"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="waveFade"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                >
                    <stop
                        offset="0%"
                        stopColor="#ffffff"
                        stopOpacity="0"
                    />

                    <stop
                        offset="45%"
                        stopColor="#ffffff"
                        stopOpacity="0.09"
                    />

                    <stop
                        offset="100%"
                        stopColor="#ffffff"
                        stopOpacity="0.15"
                    />
                </linearGradient>
            </defs>

            {bandA.map((d, i) => (
                <path
                    key={`a-${i}`}
                    d={d}
                    fill="none"
                    stroke="url(#waveFade)"
                    strokeWidth="1"
                />
            ))}

            {bandB.map((d, i) => (
                <path
                    key={`b-${i}`}
                    d={d}
                    fill="none"
                    stroke="url(#waveFade)"
                    strokeWidth="1"
                />
            ))}
        </svg>
    );
}