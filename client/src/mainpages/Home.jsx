import React from 'react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF1E0] px-6 text-center">
            <h1 className="text-5xl font-cormorant text-[#4B2E2B] font-semibold mb-6">
                Welcome to Bookworm AI
            </h1>

            <p className="text-[#5C4033] text-lg max-w-2xl mb-8 leading-relaxed">
                Track your reading journey, manage your personal library,<br />
                and discover your next favorite book with a virtual assistant that understands you.
            </p>

            <blockquote className="text-[#6B4E3D] italic border-l-4 border-[#D6C1B0] pl-4 text-sm max-w-xl">
                “A room without books is like a body without a soul.” <br />
                <span className="text-xs text-[#9C7E6B]">— Cicero</span>
            </blockquote>
        </div>
    );
}
