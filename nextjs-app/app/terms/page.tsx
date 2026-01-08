export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg">
        <p className="text-lg text-gray-600 mb-4">
          Last Updated: January 2026
        </p>

        <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">⚠️ CRITICAL DISCLAIMER</h2>
          <p className="text-red-900 font-bold mb-4">
            Sturdy is NOT a substitute for professional therapy, medical advice, or emergency services.
          </p>
          <p className="text-red-900">
            If your child is in danger, call 911 or your local emergency services immediately.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">1. What Sturdy Is and Is Not</h2>
        <p>✅ Sturdy provides AI-generated parenting suggestions</p>
        <p>❌ Sturdy is NOT therapy</p>
        <p>❌ Sturdy is NOT medical advice</p>
        <p>❌ Sturdy is NOT a replacement for professional help</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Your Responsibility</h2>
        <p>You agree to:</p>
        <ul>
          <li>Review scripts before using them</li>
          <li>Adapt scripts to your child's needs</li>
          <li>Seek professional help when needed</li>
          <li>Not use Sturdy as a substitute for emergency services</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. When to Seek Help</h2>
        <p className="font-bold">Stop using Sturdy and seek professional help if:</p>
        <ul>
          <li>Child has thoughts of self-harm or suicide</li>
          <li>Child is being abused or neglected</li>
          <li>Behavior is escalating</li>
          <li>You feel out of control</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Crisis Resources</h2>
        <ul>
          <li>National Suicide Prevention Lifeline: 988</li>
          <li>Crisis Text Line: Text HOME to 741741</li>
          <li>Childhelp National Hotline: 1-800-422-4453</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">5. No Warranty or Liability</h2>
        <p className="font-bold text-red-600">
          Sturdy comes with NO WARRANTY and NO LIABILITY.
        </p>
        <p>
          We are not liable for harm, mistakes, data loss, or outcomes from using Sturdy.
          Use at your own risk.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">6. Acceptable Use</h2>
        <p>You agree NOT to:</p>
        <ul>
          <li>Use Sturdy to harm children</li>
          <li>Abuse or neglect children</li>
          <li>Violate privacy</li>
          <li>Share accounts</li>
          <li>Hack or reverse-engineer Sturdy</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">7. Account Termination</h2>
        <p>
          We may terminate your account if you violate these terms or abuse the service.
        </p>

        <p className="mt-8 text-gray-600">
          Questions? Email: support@sturdy-app.com
        </p>
      </div>
    </div>
  )
}
