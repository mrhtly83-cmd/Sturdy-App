/**
 * Sturdy Design System Components
 * Pre-built components following the glassmorphism design system
 */

import React from 'react';
import { cn } from './design-system';

// Primary CTA Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-full transition-all duration-300 transform hover:scale-105';
  
  const variants = {
    primary: 'bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white shadow-2xl hover:shadow-coral-500/50',
    secondary: 'backdrop-blur-md bg-white/10 border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white',
    glass: 'backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white',
  };
  
  const sizes = {
    sm: 'px-6 py-2 text-base',
    md: 'px-8 py-3 text-lg',
    lg: 'px-10 py-4 text-lg',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Glass Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl',
        hover && 'hover:bg-white/20 transition-all duration-300 transform hover:scale-105',
        className
      )}
    >
      {children}
    </div>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, icon, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full',
        className
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{children}</span>
    </div>
  );
};

// Container Component
interface ContainerProps {
  children: React.ReactNode;
  size?: 'mobile' | 'tablet' | 'desktop';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'mobile',
  className,
}) => {
  const sizes = {
    mobile: 'max-w-md',
    tablet: 'max-w-2xl',
    desktop: 'max-w-4xl',
  };
  
  return (
    <div className={cn('mx-auto', sizes[size], className)}>
      {children}
    </div>
  );
};

// Section with animation
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  animate = true,
}) => {
  return (
    <section
      className={cn(
        animate && 'animate-fade-in',
        className
      )}
    >
      {children}
    </section>
  );
};

// Text components with design system styles
export const Headline: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h1 className={cn('text-5xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-2xl', className)}>
    {children}
  </h1>
);

export const Subheadline: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn('text-lg text-gray-100 font-medium drop-shadow-lg', className)}>
    {children}
  </p>
);

export const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn('text-base md:text-lg text-gray-200 font-medium leading-relaxed', className)}>
    {children}
  </p>
);
