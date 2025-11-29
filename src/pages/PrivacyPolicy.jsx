import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-white pt-24 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-400 mb-8 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
          
          <div className="bg-dark-900 rounded-xl p-8 shadow-2xl border border-dark-800">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-dark-400 mb-8">Last Updated: Feb 2025</p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">1. INTRODUCTION</h2>
              <p className="text-dark-300 mb-4">
                Code_Quality is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and disclose your information when you use:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Our browser extension(s)</li>
                <li>Web dashboards</li>
                <li>Work-tracking tools</li>
                <li>Manager review dashboards</li>
                <li>AI-powered code review features</li>
                <li>Any related products or services ("Services")</li>
              </ul>
              <p className="text-dark-300">
                By accessing or using Code_Quality, you agree to this Policy. If you do not agree, please do not use our Services.
                We may update this Policy from time to time. Continued use of the Services after changes means you accept the updated Policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">2. INFORMATION WE COLLECT & HOW WE COLLECT IT</h2>
              <p className="text-dark-300 mb-4">We collect only the minimum required information to operate our Services.</p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">A. Information You Provide</h3>
              <h4 className="font-semibold text-lg mb-2">Personal Information</h4>
              <p className="text-dark-300 mb-4">
                When you sign up or connect an account, we may collect:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Workspace / organization name</li>
                <li>Role (developer, manager, admin)</li>
              </ul>

              <h4 className="font-semibold text-lg mb-2">Payment Information</h4>
              <p className="text-dark-300 mb-6">
                If you purchase premium features, payments are handled by our authorized payment processors (e.g., Stripe).
                We do not store your full credit-card or payment details.
              </p>

              <h4 className="font-semibold text-lg mb-2">User Inputs & Code Snippets</h4>
              <p className="text-dark-300 mb-4">
                When you request an AI code review, debugging help, refactoring, or analysis, you may input:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Code snippets</li>
                <li>Repository links or selected files</li>
                <li>Comments or instructions</li>
                <li>Work logs (if using tracking features)</li>
              </ul>
              <p className="text-dark-300 mb-6">
                This data is processed solely to provide the requested service.
              </p>

              <h4 className="font-semibold text-lg mb-2">Manager & Team Dashboard Data</h4>
              <p className="text-dark-300 mb-4">
                Managers may upload or track:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Team member productivity reports</li>
                <li>Work logs and assignments</li>
                <li>Project metadata</li>
                <li>Feedback notes</li>
              </ul>
              <p className="text-dark-300 mb-6">
                This information is controlled by your organization. We act only as a service provider.
              </p>

              <h3 className="text-xl font-medium mt-8 mb-3">B. Information Collected Automatically</h3>
              <p className="text-dark-300 mb-4">
                When you use our extension, dashboard, or website, we automatically collect:
              </p>
              <h4 className="font-semibold text-lg mb-2">Usage Information</h4>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Features used</li>
                <li>AI review requests</li>
                <li>Clicks, interactions</li>
                <li>Timestamps</li>
              </ul>

              <h4 className="font-semibold text-lg mb-2">Device Information</h4>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>IP address</li>
                <li>Browser type</li>
                <li>OS/device type</li>
                <li>Extension version</li>
              </ul>

              <h4 className="font-semibold text-lg mb-2">Cookies & Similar Technologies</h4>
              <p className="text-dark-300 mb-4">
                We may use:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Cookies (session & persistent)</li>
                <li>Local storage</li>
                <li>Web beacons</li>
                <li>Tracking pixels (analytics only)</li>
              </ul>
              <p className="text-dark-300 mb-6">
                You can block cookies, but some features may stop working.
              </p>

              <h3 className="text-xl font-medium mt-8 mb-3">C. Information from Integrations</h3>
              <p className="text-dark-300 mb-4">
                If you connect external platforms, we may receive:
              </p>
              <h4 className="font-semibold text-lg mb-2">GitHub / GitLab / Bitbucket / Azure DevOps</h4>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Token for repository access</li>
                <li>Repo names & metadata</li>
                <li>User/organization ID</li>
                <li>Commit information</li>
                <li>Permissions granted</li>
              </ul>
              <p className="text-dark-300 mb-6 font-semibold">
                We do NOT access your passwords.<br />
                We do NOT store full repository code.
              </p>

              <h4 className="font-semibold text-lg mb-2">AI Model Providers</h4>
              <p className="text-dark-300 mb-4">
                We use external LLM providers such as:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>OpenAI (GPT models)</li>
                <li>Anthropic (Claude models)</li>
                <li>Google (Gemini)</li>
                <li>Other optional LLM providers</li>
              </ul>
              <p className="text-dark-300 mb-6">
                We send only the necessary input data required to generate the requested code review.
                We never allow your data to be used to train AI models, unless the provider's own platform settings enforce otherwise (e.g., OpenAI's "No training on API data" policy).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">3. DO NOT TRACK (DNT)</h2>
              <p className="text-dark-300">
                Code_Quality does not track users across third-party sites, and we do not respond to DNT signals.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">4. CHILDREN'S PRIVACY</h2>
              <p className="text-dark-300">
                Code_Quality is intended for users 13 years and older.
                We do not knowingly collect information from children under 13.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">5. HOW WE USE YOUR INFORMATION</h2>
              <p className="text-dark-300 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Provide AI-powered code reviews</li>
                <li>Improve code-quality suggestions</li>
                <li>Operate team dashboards</li>
                <li>Track work logs (if enabled)</li>
                <li>Manage accounts & authentication</li>
                <li>Process payments</li>
                <li>Improve, maintain, and secure our platform</li>
                <li>Personalize content & recommendations</li>
                <li>Communicate service updates</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-dark-300 font-semibold">
                We never use customer code, prompts, or outputs to train our AI models.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">6. LEGAL BASES FOR PROCESSING</h2>
              <p className="text-dark-300 mb-4">
                We rely on:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Contractual necessity – to provide the Service</li>
                <li>Legitimate interest – improve & secure our platform</li>
                <li>Consent – for optional features</li>
                <li>Compliance with laws</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">7. HOW WE SHARE INFORMATION</h2>
              <p className="text-dark-300 font-semibold mb-6">
                We do NOT sell your personal data.
              </p>
              <p className="text-dark-300 mb-4">
                We may share information only with:
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">A. Service Providers</h3>
              <p className="text-dark-300 mb-4">
                Including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Stripe (payments)</li>
                <li>Hosting providers</li>
                <li>Logging & monitoring tools</li>
                <li>Analytics tools</li>
                <li>Email providers (e.g., Mailchimp, SendGrid)</li>
              </ul>
              <p className="text-dark-300 mb-6">
                They receive only the data required to perform their function.
              </p>

              <h3 className="text-xl font-medium mt-8 mb-3">B. AI Model Providers (for code reviews)</h3>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>OpenAI</li>
                <li>Anthropic</li>
                <li>Google</li>
                <li>Other integrated LLMs</li>
              </ul>
              <p className="text-dark-300 mb-6">
                Your prompts/code are used only to generate a response, NOT for training.
              </p>

              <h3 className="text-xl font-medium mt-8 mb-3">C. Organizational Administrators</h3>
              <p className="text-dark-300 mb-4">
                If your company uses Code_Quality:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Managers may access employee logs</li>
                <li>Workspace admins may see team activity</li>
                <li>Organization-wide dashboards may show aggregated metrics</li>
              </ul>

              <h3 className="text-xl font-medium mt-8 mb-3">D. Legal & Safety Requirements</h3>
              <p className="text-dark-300 mb-4">
                We may disclose data to government, law enforcement, or regulators if required to:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Comply with the law</li>
                <li>Protect rights, security, or prevent fraud</li>
                <li>Respond to subpoenas or investigations</li>
              </ul>

              <h3 className="text-xl font-medium mt-8 mb-3">E. Corporate Transactions</h3>
              <p className="text-dark-300">
                In case of merger, acquisition, or asset sale, your data may transfer as part of the business.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">8. THIRD-PARTY LINKS</h2>
              <p className="text-dark-300">
                We are not responsible for external websites or platforms linked through Code_Quality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">9. YOUR RIGHTS & CHOICES</h2>
              <p className="text-dark-300 mb-4">
                Depending on your region, you may have rights to:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Access your data</li>
                <li>Update or correct your data</li>
                <li>Delete your data</li>
                <li>Download/export your data</li>
                <li>Object to certain processing</li>
                <li>Opt out of marketing emails</li>
                <li>Disable cookies</li>
              </ul>
              <p className="text-dark-300">
                To exercise these rights, contact: <a href="mailto:codequality01@gmail.com" className="text-primary-500 hover:underline">codequality01@gmail.com</a>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">10. INTERNATIONAL DATA TRANSFERS</h2>
              <p className="text-dark-300 mb-4">
                Your data may be processed on servers in:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>India</li>
                <li>United States</li>
                <li>EU</li>
                <li>Other regions depending on infrastructure providers</li>
              </ul>
              <p className="text-dark-300">
                We follow applicable data protection laws, including GDPR.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">11. SECURITY</h2>
              <p className="text-dark-300">
                We use administrative, technical, and physical safeguards to protect your data.
                No system is fully secure — please protect your credentials.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">12. DATA RETENTION</h2>
              <p className="text-dark-300 mb-4">
                We retain data based on:
              </p>
              <ul className="list-disc pl-6 text-dark-300 space-y-2 mb-6">
                <li>Active account duration</li>
                <li>Legal and regulatory requirements</li>
                <li>Error logs and analytics needs</li>
                <li>Organization settings</li>
              </ul>
              <p className="text-dark-300">
                You may request deletion at any time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">13. CHANGES TO THIS POLICY</h2>
              <p className="text-dark-300">
                Updates will be posted on this page with a new "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-400">14. CONTACT US</h2>
              <p className="text-dark-300">
                For privacy questions or concerns:
              </p>
              <p className="text-dark-300 mt-2">
                Email: <a href="mailto:codequality01@gmail.com" className="text-primary-500 hover:underline">codequality01@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
