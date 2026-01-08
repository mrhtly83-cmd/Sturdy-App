'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1) // Step 1-4
  const [parentInfo, setParentInfo] = useState({
    neurotype: '',
    mainStruggle: '',
    parentsInHome: '1',
    lookingFor: [],
  })

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save and redirect to dashboard
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding_complete', 'true')
      }
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">
                Welcome to Sturdy! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Let's set up your profile so we can give you personalized parenting strategies.
              </p>
            </div>

            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6">
              <p className="text-gray-700 font-semibold mb-3">What Sturdy does:</p>
              <ul className="space-y-2 text-gray-700">
                <li>✅ AI-powered parenting scripts tailored to YOUR family</li>
                <li>✅ Evidence-based strategies from child development experts</li>
                <li>✅ Quick solutions for everyday challenges</li>
                <li>✅ Proactive planning for better parent-child relationships</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 font-semibold mb-3">This is NOT:</p>
              <ul className="space-y-2 text-gray-700">
                <li>❌ A replacement for therapy or medical care</li>
                <li>❌ Emergency mental health support</li>
                <li>❌ Parenting judgment or criticism</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 2: Your Neurotype */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Tell us about YOU 🧠
              </h2>
              <p className="text-gray-600">
                What's your neurotype or parenting context? (This helps us match strategies to your situation)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'adhd', label: '🤔 ADHD' },
                { value: 'autism', label: '🌈 Autism' },
                { value: 'anxiety', label: '😰 Anxiety' },
                { value: 'pda', label: '🔄 PDA' },
                { value: 'trauma', label: '💙 Trauma-informed' },
                { value: 'neurodivergent', label: '✨ Other ND' },
                { value: 'neurotypical', label: '👤 Neurotypical' },
                { value: 'unsure', label: '❓ Still figuring it out' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setParentInfo({...parentInfo, neurotype: option.value})}
                  className={`p-4 rounded-lg font-semibold text-lg transition-all ${
                    parentInfo.neurotype === option.value
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 italic">
              You can change this anytime in settings.
            </p>
          </div>
        )}

        {/* STEP 3: Main Challenge */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                What's your biggest parenting challenge? 🎯
              </h2>
              <p className="text-gray-600">
                What struggle brought you to Sturdy?
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'bedtime', label: '🛏️ Bedtime resistance' },
                { value: 'tantrums', label: '😤 Tantrums & meltdowns' },
                { value: 'homework', label: '📚 Homework battles' },
                { value: 'defiance', label: '🚫 Not listening / defiance' },
                { value: 'aggression', label: '🤛 Aggression or hitting' },
                { value: 'sibling', label: '👶 Sibling conflict' },
                { value: 'transitions', label: '🔄 Transitions & changes' },
                { value: 'other', label: '💭 Something else' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setParentInfo({...parentInfo, mainStruggle: option.value})}
                  className={`w-full p-4 rounded-lg font-semibold text-left transition-all ${
                    parentInfo.mainStruggle === option.value
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: What They're Looking For */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                What are you looking for? 🔍
              </h2>
              <p className="text-gray-600">
                Select what would help you most
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'quick_scripts', label: '⚡ Quick scripts for difficult moments' },
                { value: 'long_term', label: '🌱 Long-term behavior strategies' },
                { value: 'understanding', label: '💡 Understanding why kids do what they do' },
                { value: 'prevention', label: '🛡️ Prevention strategies' },
                { value: 'connection', label: '💕 Deeper parent-child connection' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={parentInfo.lookingFor.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setParentInfo({
                          ...parentInfo,
                          lookingFor: [...parentInfo.lookingFor, option.value]
                        })
                      } else {
                        setParentInfo({
                          ...parentInfo,
                          lookingFor: parentInfo.lookingFor.filter(v => v !== option.value)
                        })
                      }
                    }}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-semibold text-gray-800">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              (step === 2 && !parentInfo.neurotype) ||
              (step === 3 && !parentInfo.mainStruggle) ||
              (step === 4 && parentInfo.lookingFor.length === 0)
            }
            className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {step === 4 ? 'Complete Setup →' : 'Next →'}
          </button>
        </div>

        {/* Skip Option */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('onboarding_complete', 'true')
            }
            router.push('/dashboard')
          }}
          className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm font-semibold"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
