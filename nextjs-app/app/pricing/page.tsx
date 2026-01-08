'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function PricingPage() {
  const { user } = useAuth()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever',
      description: 'Perfect for trying Sturdy',
      features: [
        '5 SOS scripts per month',
        '1 What If plan per month',
        'Basic child profiles',
        'Email support',
        'Mobile app access',
      ],
      notIncluded: [
        'Unlimited scripts',
        'Script library access',
        'Co-parent invites',
        'Priority support',
        'Advanced analytics',
      ],
      cta: 'Get Started',
      ctaHref: user ? '/dashboard' : '/auth/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'Most popular for active parents',
      features: [
        'Unlimited SOS scripts',
        'Unlimited What If plans',
        'Unlimited child profiles',
        'Save & organize scripts',
        'Priority email support',
        'Mobile app access',
        'Monthly strategy digest',
        'Download as PDF',
      ],
      notIncluded: [
        'Co-parent invites',
        'Phone support',
        'Advanced analytics',
      ],
      cta: 'Start Pro Trial',
      ctaHref: user ? '/dashboard' : '/auth/signup',
      highlight: true,
    },
    {
      name: 'Family',
      price: '$14.99',
      period: '/month',
      description: 'For co-parenting teams',
      features: [
        'Everything in Pro',
        'Invite co-parents',
        'Shared script library',
        'Real-time updates',
        'Family calendar view',
        'Group message board',
        'Phone support',
        'Bi-weekly check-ins',
        'Advanced analytics',
      ],
      notIncluded: [],
      cta: 'Start Family Trial',
      ctaHref: user ? '/dashboard' : '/auth/signup',
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          All plans include a free 7-day trial. No credit card required. Cancel anytime.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl transition-all duration-300 animate-slide-up ${
              plan.highlight
                ? 'ring-2 ring-teal-600 shadow-2xl transform md:scale-105'
                : 'border border-gray-200 hover:shadow-lg'
            }`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
            )}

            <div className={`p-8 ${plan.highlight ? 'bg-gradient-to-br from-teal-50 to-blue-50' : 'bg-white'}`}>
              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">
                    {plan.period}
                  </span>
                </div>
                {plan.price !== '$0' && (
                  <p className="text-sm text-gray-500 mt-2">
                    First month free, then {plan.price} {plan.period.includes('/') ? 'billed monthly' : 'billed once'}
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href={plan.ctaHref}
                className={`block w-full py-3 px-4 rounded-lg font-bold text-center transition-all transform hover:scale-105 mb-8 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features Included */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  What's Included
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-teal-600 font-bold text-lg">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              {plan.notIncluded.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Not Included
                  </p>
                  <ul className="space-y-2">
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="text-gray-300 text-lg">×</span>
                        <span className="text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-900">
                  Feature
                </th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">
                  Free
                </th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">
                  Pro
                </th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">
                  Family
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'SOS Scripts', free: '5/mo', pro: 'Unlimited', family: 'Unlimited' },
                { label: 'What If Plans', free: '1/mo', pro: 'Unlimited', family: 'Unlimited' },
                { label: 'Child Profiles', free: '1', pro: 'Unlimited', family: 'Unlimited' },
                { label: 'Save Scripts', free: '✗', pro: '✓', family: '✓' },
                { label: 'Co-Parent Invites', free: '✗', pro: '✗', family: '✓' },
                { label: 'Family Calendar', free: '✗', pro: '✗', family: '✓' },
                { label: 'Download PDFs', free: '✗', pro: '✓', family: '✓' },
                { label: 'Email Support', free: '✓', pro: '✓', family: '✓' },
                { label: 'Phone Support', free: '✗', pro: '✗', family: '✓' },
              ].map((row, idx) => (
                <tr
                  key={row.label}
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {row.label}
                  </td>
                  <td className="text-center py-4 px-4 text-gray-700">
                    {row.free}
                  </td>
                  <td className="text-center py-4 px-4 text-gray-700">
                    {row.pro}
                  </td>
                  <td className="text-center py-4 px-4 text-gray-700 font-semibold">
                    {row.family}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Billing Questions
        </h2>
        <div className="space-y-4">
          <details className="group p-6 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
            <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
              <span>Do I need a credit card for the free trial?</span>
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Nope! Try Pro or Family plan free for 7 days. No credit card required.
            </p>
          </details>

          <details className="group p-6 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
            <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
              <span>Can I cancel anytime?</span>
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Yes! Cancel your subscription anytime with one click. No questions asked.
            </p>
          </details>

          <details className="group p-6 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
            <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
              <span>What's included in the Family plan?</span>
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Everything in Pro, plus co-parent invites, shared library, family calendar, and phone support.
            </p>
          </details>

          <details className="group p-6 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
            <summary className="font-bold text-lg text-gray-900 flex items-center justify-between">
              <span>Do you offer refunds?</span>
              <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-700">
              Not satisfied? Contact us within 30 days for a full refund.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}
