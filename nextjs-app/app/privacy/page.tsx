export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p className="text-lg text-gray-600 mb-4">
          Last Updated: January 2026
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <ul>
          <li>Email address</li>
          <li>Password (hashed, never stored in plain text)</li>
          <li>Child names and ages</li>
          <li>Neurotype selections (ADHD, Autism, Anxiety, PDA, etc.)</li>
          <li>Scripts generated and timestamps</li>
          <li>Subscription information</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Data</h2>
        <p>✅ To provide personalized parenting scripts</p>
        <p>✅ To store your scripts for reference</p>
        <p>✅ To improve Sturdy (anonymized analysis)</p>
        <p>❌ We do NOT sell your data to third parties</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
        <p>
          All data is encrypted in transit (HTTPS) and at rest (Supabase).
          Child names are scrubbed before sending to OpenAI.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Your Rights</h2>
        <p>You can:</p>
        <ul>
          <li>Access your data</li>
          <li>Export your scripts</li>
          <li>Delete your account</li>
          <li>Opt-out of analytics</li>
        </ul>

        <p className="mt-8 text-gray-600">
          Questions? Email: privacy@sturdy-app.com
        </p>
      </div>
    </div>
  )
}
