'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  IoChatbubbleEllipsesOutline, 
  IoStarSharp, 
  IoSettingsSharp, 
  IoCheckmarkSharp,
  IoPlayCircleOutline 
} from 'react-icons/io5';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: IoChatbubbleEllipsesOutline,
      title: 'Calm words, on demand',
      description: 'Ready when life happens.'
    },
    {
      icon: IoStarSharp,
      title: 'Science-backed',
      description: 'Connection-first words you can trust.'
    },
    {
      icon: IoSettingsSharp,
      title: 'Personalized in seconds',
      description: 'Tone + context tuned to your family.'
    }
  ];

  const testimonials = [
    {
      text: "Sturdy has transformed my parenting. The scripts are exactly what I need in the moment.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "Science-backed and so practical. I feel more confident every day.",
      author: "Michael T.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Mobile App Container */}
      <div className="w-full max-w-[430px] min-h-screen bg-gray-900 relative overflow-hidden shadow-2xl">
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
          {/* Enhanced animated gradient overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
          {/* Animated gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-tr from-coral-500/20 via-transparent to-teal-500/20 animate-pulse"></div>
        </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-coral-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-teal-300/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content Layer - Mobile-First Design */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Premium logo with trust badge */}
        <div className="mb-12 flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-coral-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl">
              <IoCheckmarkSharp className="w-8 h-8" />
            </div>
            <span className="text-white font-black text-4xl tracking-tight">STURDY</span>
          </div>
          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <span className="text-white text-sm font-semibold">Trusted by 10,000+ parents</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl font-black text-white text-center mb-6 leading-tight tracking-tight drop-shadow-2xl max-w-md">
          Calm words,<br />on demand.
        </h1>

        {/* Subheading with better contrast */}
        <p className="text-lg text-gray-100 text-center mb-4 drop-shadow-lg max-w-md font-medium">
          Science-backed parenting scripts that help you stay connected and confident when parenting gets tough.
        </p>

        {/* Trust line */}
        <p className="text-sm text-teal-300 text-center mb-12 font-semibold">
          AI-powered guidance • Evidence-based • Personalized for your family
        </p>

        {/* Premium Feature Cards - Enhanced Glassmorphism */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer group shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform">
                    <IconComponent className="w-12 h-12 text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg group-hover:text-teal-300 transition">
                      {feature.title}
                    </h3>
                    <p className="text-gray-200 text-base mt-2">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent CTA Buttons - Conversion Optimized */}
        <div className="flex flex-col items-center gap-4 mb-8 w-full max-w-md">
          <button
            onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
            className="w-full px-10 py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-coral-600 to-coral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => {
              // TODO: Replace with actual demo video URL when available
              // For now, navigate to pricing page as alternative
              router.push('/pricing');
            }}
            className="w-full px-10 py-4 backdrop-blur-md bg-white/10 border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <IoPlayCircleOutline className="w-6 h-6" />
              Watch Demo
            </span>
          </button>
        </div>

        {/* Social Proof - Ratings */}
        <div className="flex items-center gap-2 mb-4 backdrop-blur-md bg-white/5 border border-white/20 rounded-full px-6 py-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <IoStarSharp key={i} className="w-5 h-5 text-yellow-400" />
            ))}
          </div>
          <span className="text-white font-semibold text-sm">4.9/5</span>
          <span className="text-gray-300 text-sm ml-2">(2,000+ reviews)</span>
        </div>

        {/* Testimonials - Glassmorphism Cards */}
        <div className="w-full max-w-md grid grid-cols-1 gap-4 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <IoStarSharp key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-white text-sm mb-3 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              <p className="text-gray-300 text-xs font-semibold">— {testimonial.author}</p>
            </div>
          ))}
        </div>

        {/* Trust text below CTAs */}
        <p className="text-sm text-gray-300 text-center">
          ✓ Free 7-day trial • No credit card required • Cancel anytime
        </p>

      </div>
      </div>
    </div>
  );
}
