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
        {/* Enhanced gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Content Layer - Centered Mobile-First Design */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Premium logo with trust badge */}
        <div className="mb-12 flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-coral-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl">
              ✓
            </div>
            <span className="text-white font-black text-4xl tracking-tight">STURDY</span>
          </div>
          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <span className="text-white text-sm font-semibold">Trusted by 10,000+ parents</span>
          </div>
        </div>

        {/* Main headline - larger, bolder */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white text-center mb-6 leading-tight tracking-tight drop-shadow-2xl max-w-4xl">
          Calm words,<br />on demand.
        </h1>

        {/* Subheading with better contrast */}
        <p className="text-lg md:text-xl text-gray-100 text-center mb-4 drop-shadow-lg max-w-2xl font-medium">
          Science-backed parenting scripts that help you stay connected and confident when parenting gets tough.
        </p>

        {/* Trust line */}
        <p className="text-sm md:text-base text-teal-300 text-center mb-12 font-semibold">
          AI-powered guidance • Evidence-based • Personalized for your family
        </p>

        {/* Premium Feature Cards - Glassmorphism */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0">{feature.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-teal-300 transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-base mt-2">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prominent CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <button
            onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
          </button>

          <button
            onClick={() => router.push('/pricing')}
            className="w-full md:w-auto px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105"
          >
            View Pricing
          </button>
        </div>

        {/* Trust text below CTAs */}
        <p className="text-sm text-gray-300 text-center">
          ✓ Free 7-day trial • No credit card required • Cancel anytime
        </p>

      </div>
    </div>
  );
}
