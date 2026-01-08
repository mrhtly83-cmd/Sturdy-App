'use client'
import { useState } from 'react'

export default function LegalAcceptance({ onAccept }) {
  const [checks, setChecks] = useState({
    privacy: false,
    terms: false,
    disclaimer: false,
    liability: false,
    crisis: false,
  })

  const allChecked = Object.values(checks).every(v => v === true)

  return (
    <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-300">
      <h3 className="text-xl font-bold mb-6">Please Review & Accept</h3>
      
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checks.privacy}
            onChange={(e) => setChecks({...checks, privacy: e.target.checked})}
            className="mt-1 w-5 h-5"
          />
          <span>
            I have read and agree to the <a href="/privacy" className="text-blue-600 underline" target="_blank">Privacy Policy</a>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checks.terms}
            onChange={(e) => setChecks({...checks, terms: e.target.checked})}
            className="mt-1 w-5 h-5"
          />
          <span>
            I have read and agree to the <a href="/terms" className="text-blue-600 underline" target="_blank">Terms of Service</a>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checks.disclaimer}
            onChange={(e) => setChecks({...checks, disclaimer: e.target.checked})}
            className="mt-1 w-5 h-5"
          />
          <span>
            I have read and understand the <a href="/disclaimers" className="text-blue-600 underline" target="_blank">Legal Disclaimers</a>
          </span>
        </label>

        <div className="bg-red-50 p-4 rounded border-2 border-red-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.liability}
              onChange={(e) => setChecks({...checks, liability: e.target.checked})}
              className="mt-1 w-5 h-5"
            />
            <span className="text-red-900 font-bold">
              I understand Sturdy is NOT therapy or medical advice and comes with NO LIABILITY
            </span>
          </label>
        </div>

        <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.crisis}
              onChange={(e) => setChecks({...checks, crisis: e.target.checked})}
              className="mt-1 w-5 h-5"
            />
            <span className="text-yellow-900 font-bold">
              I will seek professional help if my child is in danger (911 or crisis line)
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={onAccept}
        disabled={!allChecked}
        className="w-full mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg font-bold disabled:opacity-50"
      >
        {allChecked ? 'Accept & Continue' : 'Please accept all terms to continue'}
      </button>
    </div>
  )
}
