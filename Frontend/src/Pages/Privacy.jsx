import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/signup" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign Up
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: February 9, 2026</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Introduction</h2>
              <p>HostelMate is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Full name, email address, and room number</li>
                <li>Password (securely hashed)</li>
                <li>Karma points and activity history</li>
                <li>Favor requests and completions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To create and manage your account</li>
                <li>To facilitate favor exchanges between hostel members</li>
                <li>To display leaderboard rankings</li>
                <li>To improve our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Information Sharing</h2>
              <p>Your name and room number are visible to other hostel members for favor requests. We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Data Security</h2>
              <p>We implement security measures including password hashing, SSL encryption, and secure database storage to protect your data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">6. Your Rights</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request account deletion</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">7. Contact Us</h2>
              <p>For privacy concerns, contact us at: <strong>privacy@hostelmate.com</strong></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;

