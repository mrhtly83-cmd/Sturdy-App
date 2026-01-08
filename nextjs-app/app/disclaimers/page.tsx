export default function DisclaimersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Legal Disclaimers</h1>
      
      <div className="prose prose-lg">
        <div className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            🔴 PLEASE READ CAREFULLY
          </h2>
          <p className="text-yellow-900 font-bold">
            This legal document is important. Review it before using Sturdy.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Medical & Mental Health Disclaimer</h2>
        <p className="font-bold text-red-600 mb-4">
          Sturdy is NOT:
        </p>
        <ul>
          <li>Medical advice or diagnosis</li>
          <li>Mental health treatment or therapy</li>
          <li>Professional counseling</li>
          <li>A substitute for licensed professionals</li>
          <li>Emergency mental health support</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">AI Limitations</h2>
        <p>
          Our AI-generated scripts:
        </p>
        <ul>
          <li>Are suggestions only</li>
          <li>May not work for every child</li>
          <li>Should be adapted to your family</li>
          <li>May contain errors or inappropriate suggestions</li>
          <li>Are not guaranteed to be effective</li>
        </ul>
        <p className="font-bold mt-4">
          YOU are responsible for reviewing and adapting scripts before using them.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">No Endorsement</h2>
        <p>
          Sturdy is informed by research from Dr. Becky Kennedy, Adele Faber & Elaine Mazlish, 
          Daniel Siegel, and Emily Oster. However, these authors do NOT endorse Sturdy. 
          Their frameworks are inspiration, not guarantees.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">HIPAA Notice</h2>
        <p className="font-bold">
          Sturdy is NOT a HIPAA-covered entity.
        </p>
        <p>
          We are not bound by HIPAA privacy rules. Your data is protected under standard 
          privacy laws, not healthcare privacy laws.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Liability Waiver</h2>
        <p className="font-bold text-red-600 mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW:
        </p>
        <p className="bg-red-50 p-4 rounded mb-4">
          Sturdy, its creators, and hosting providers are NOT liable for any harm, 
          including but not limited to physical, emotional, or psychological harm to 
          children or families from using Sturdy or following its suggestions.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">When to Seek Emergency Help</h2>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="font-bold text-red-800 mb-4">
            STOP using Sturdy and seek immediate professional help if:
          </p>
          <ul className="text-red-900">
            <li>Your child mentions or attempts self-harm or suicide</li>
            <li>Your child is being physically, sexually, or emotionally abused</li>
            <li>Your child is being neglected</li>
            <li>Behavioral problems are getting worse despite using Sturdy</li>
            <li>You feel out of control or are harming your child</li>
            <li>Your child exhibits signs of a severe mental health condition</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Emergency Resources</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <ul className="text-blue-900">
            <li><strong>National Suicide Prevention Lifeline:</strong> 988 (call or text)</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
            <li><strong>SAMHSA National Helpline:</strong> 1-800-662-4357</li>
            <li><strong>Childhelp National Hotline:</strong> 1-800-422-4453</li>
            <li><strong>Emergency:</strong> 911</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">User Acknowledgment</h2>
        <p className="bg-gray-100 p-4 rounded">
          By using Sturdy, you acknowledge that:
        </p>
        <ul className="bg-gray-50 p-4 rounded">
          <li>You have read these disclaimers</li>
          <li>You understand Sturdy is not professional mental health care</li>
          <li>You understand the limitations and risks</li>
          <li>You are responsible for your parenting decisions</li>
          <li>You agree to seek professional help when needed</li>
        </ul>

        <p className="mt-8 text-gray-600">
          Questions? Email: legal@sturdy-app.com
        </p>
      </div>
    </div>
  )
}
