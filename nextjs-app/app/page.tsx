'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: '💬',
      title: 'Calm words, on demand',
      description: 'Ready when life happens.'
    },
    {
      icon: '⭐',
      title: 'Science-backed',
      description: 'Connection-first words you can trust.'
    },
    {
      icon: '⚙️',
      title: 'Personalized in seconds',
      description: 'Tone + context tuned to your family.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-900 relative overflow-hidden">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Layer - Centered Mobile-First Design */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Logo Section */}
        <div className="mb-12 flex items-center gap-3 animate-fadeIn">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
            ✓
          </div>
          <span className="text-white font-black text-3xl tracking-wide">STURDY</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-6 drop-shadow-lg max-w-2xl leading-tight">
          Calm words, on demand.
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-gray-100 text-center mb-16 drop-shadow-md max-w-2xl">
          Science-backed scripts that help you stay connected and confident when parenting gets tough.
        </p>

        {/* Feature Cards - Mobile Optimized */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition duration-300 transform hover:scale-105 cursor-pointer group shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base md:text-lg group-hover:text-teal-300 transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Text */}
        <p className="text-gray-300 text-center mb-10 text-xs md:text-sm font-medium">
          Support, exactly when you need it.
        </p>

        {/* Continue Button */}
        <button
          onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
          className="px-10 py-3 md:px-12 md:py-4 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:from-teal-600 hover:via-teal-700 hover:to-teal-800 text-white font-bold text-base md:text-lg rounded-full shadow-2xl hover:shadow-3xl transition duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 md:gap-3"
        >
          Continue
          <span className="text-xl md:text-2xl">›</span>
        </button>

      </div>
    </div>
  );
}
