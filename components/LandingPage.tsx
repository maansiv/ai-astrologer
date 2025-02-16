'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-24 bg-gradient-to-b from-white to-purple-50">
      <h1 className="text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 animate-gradient-x drop-shadow-[0_2px_2px_rgba(255,192,203,0.5)]">
        AI Astrologer
      </h1>
      
      <h2 className="text-2xl mb-12 text-center max-w-2xl font-semibold bg-gradient-to-r from-purple-600 to-violet-500 text-transparent bg-clip-text">
        Horoscopes That Work As Hard As Your Manifesting Journal
      </h2>

      <Link 
        href="/zodiac"
        className="inline-block"
      >
        <button className="bg-pink-500 hover:bg-pink-600 text-white text-lg py-6 px-16 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
          Choose Your Sign
        </button>
      </Link>
    </div>
  );
} 