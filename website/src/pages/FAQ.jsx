import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';

const FAQ = () => {
  const faqs = [
    {
      question: 'What is Code_Quality?',
      answer: 'Code_Quality is an AI-powered code review tool and productivity extension that analyzes AI-generated or manually written code, provides suggestions, tracks developer activity, and offers dashboards for managers to review team performance.'
    },
    {
      question: 'Does Code_Quality store my code?',
      answer: 'We only store the minimum required data to operate the service. Code snippets may be temporarily processed to generate AI reviews, but we do not store full repository code unless you explicitly enable persistent storage.'
    },
    {
      question: 'Is my code used to train any AI models?',
      answer: 'No. Your code, prompts, and usage data are never used to train GPT, Claude, Gemini, or any other models. We use AI providers strictly for inference (generating responses).'
    },
    {
      question: 'What AI models do you use?',
      answer: 'We integrate with multiple models, including:\n- OpenAI GPT models\n- Anthropic Claude models\n- Google Gemini\n- Other LLMs (optional)\n\nYou can choose which model to use inside your settings.'
    },
    {
      question: 'Does Code_Quality track developer work activity?',
      answer: 'Yes, but only if your organization enables the feature. Tracking includes:\n- Tasks completed\n- Code review requests\n- Time spent on tasks (optional)\n- Submission logs\n- Activity patterns inside the extension\n\nEmployees are notified when these features are enabled.'
    },
    {
      question: 'What information is available in the Manager Dashboard?',
      answer: 'Managers can view:\n- Activity logs\n- Productivity metrics\n- Review history\n- Assigned tasks\n- Code quality scores\n- Team performance analytics\n\nWe do not expose employees\' private messages or local system data.'
    },
    {
      question: 'Can I disable activity tracking?',
      answer: 'Yes. A workspace admin or account owner can disable:\n- Work tracking\n- Productivity scoring\n- Analytics collection\n\nThis can be changed anytime from the Admin Settings.'
    },
    {
      question: 'Does Code_Quality have access to my GitHub / GitLab credentials?',
      answer: 'No. We use OAuth tokens (provided by the platform), and we never receive or store your passwords.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use:\n- Encryption in transit (HTTPS/SSL)\n- Secure APIs\n- Strict access controls\n- Industry-grade cloud security\n- Regular audits and monitoring'
    },
    {
      question: 'Does Code_Quality collect payment information?',
      answer: 'Payments are handled entirely by third-party processors like Stripe. We do not store your credit card details.'
    },
    {
      question: 'How can I delete my account or data?',
      answer: 'You can request deletion through:\n- In-app account settings, or\n- Emailing support@codequality.ai\n\nOnce requested, deletion happens within 30 days (or as required by law).'
    },
    {
      question: 'Is Code_Quality GDPR compliant?',
      answer: 'Yes. We follow GDPR requirements for:\n- Data access\n- Data portability\n- Data deletion\n- Consent-based processing\n\nEU users can exercise their rights at any time.'
    },
    {
      question: 'Does Code_Quality work offline?',
      answer: 'The extension requires an internet connection to:\n- Communicate with AI models\n- Sync tasks and dashboards\n- Provide recommendations\n\nSome basic local features may work offline.'
    },
    {
      question: 'What data does the browser extension collect?',
      answer: 'The extension only collects:\n- Code snippets you choose to analyze\n- Your interactions with the tool\n- Extension version and performance logs\n\nIt does not collect unrelated browser activity or website history.'
    },
    {
      question: 'Can I integrate Code_Quality with my company tools?',
      answer: 'Yes. We support optional integrations with:\n- GitHub\n- GitLab\n- Bitbucket\n- Azure DevOps\n- Jira (upcoming)\n- Slack (notifications)\n\nMore integrations are coming soon.'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-dark-400">Find answers to common questions about Code_Quality</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dark-900/50 border border-dark-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <div className="prose prose-invert prose-p:text-dark-300 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2">
                  {faq.answer.split('\n').map((paragraph, i) => {
                    if (paragraph.startsWith('- ')) {
                      return <li key={i} className="text-dark-300">{paragraph.substring(2)}</li>;
                    }
                    return <p key={i} className="text-dark-300">{paragraph}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-dark-400 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              Contact our support team
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQ;
