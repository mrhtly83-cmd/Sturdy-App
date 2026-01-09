'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  IoPersonOutline,
  IoLogInOutline,
  IoCheckmarkSharp,
  IoStarSharp
} from 'react-icons/io5';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      {/* Mobile App Container */}
      <div className="w-full max-w-md min-h-screen relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Transparent Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          {/* Enhanced gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Account Bar - Glassmorphism */}
        <div className="w-full px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-primary rounded-xl flex items-center justify-center shadow-lg">
              <IoCheckmarkSharp className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight drop-shadow-lg">STURDY</span>
          </div>
          
          {user ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <IoPersonOutline className="w-5 h-5" />
              Dashboard
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 text-white font-semibold hover:bg-white/10 rounded-full transition-all flex items-center gap-2"
              >
                <IoLogInOutline className="w-5 h-5" />
                Login
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-5 py-2 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          
          {/* Main Hero Content */}
          <div className="max-w-md mx-auto space-y-6 animate-fade-in">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full shadow-lg">
              <IoStarSharp className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-white drop-shadow-lg">Trusted by 10,000+ parents</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
              Calm words,<br />on demand
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-white max-w-sm mx-auto font-medium drop-shadow-xl">
              Science-backed parenting scripts when you need them most.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 justify-center items-center pt-4">
              <button
                onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
                className="w-full px-10 py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </button>
              
              <button
                onClick={() => router.push('/pricing')}
                className="w-full px-10 py-4 backdrop-blur-xl bg-white/10 border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                See Pricing
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col items-center gap-3 pt-6 text-sm text-white">
              <div className="flex items-center gap-2">
                <IoCheckmarkSharp className="w-4 h-4 text-primary" />
                <span className="font-medium drop-shadow-lg">Free 7-day trial • No credit card required</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 pt-4 backdrop-blur-xl bg-white/10 rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <IoStarSharp key={i} className="w-5 h-5 text-accent" />
                ))}
              </div>
              <span className="text-white font-bold drop-shadow-lg">4.9/5</span>
              <span className="text-white text-sm drop-shadow-lg">(2,000+ reviews)</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
