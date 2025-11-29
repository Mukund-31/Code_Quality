import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, X } from 'lucide-react';
import Container from '../ui/Container';

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '#' },
      { name: 'API', href: '#' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Contact', href: 'mailto:codequality01@gmail.com?subject=Code%20Quality%20Inquiry' },
    ],
    resources: [
      { name: 'Community', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Status', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy', target: '_blank', rel: 'noopener noreferrer' },
      { name: 'Terms', href: '/terms', target: '_blank', rel: 'noopener noreferrer' },
      { name: 'Refund & Cancellation', href: '/refund-policy', target: '_blank', rel: 'noopener noreferrer' },
      { name: 'Security', href: '#' }
    ],
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    window.location.href = 'mailto:codequality01@gmail.com?subject=Code%20Quality%20Inquiry';
  };

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: Github, 
      href: 'https://github.com/ShashidharSarvi/Code_Quality',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      name: 'X', 
      icon: X, 
      href: 'https://x.com/ShashidharSarvi',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/company/code-quality/about/',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      href: '#',
      onClick: handleEmailClick
    },
  ];

  return (
    <footer className="bg-dark-950 border-t border-dark-800">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Code Quality" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-white">Code Quality</span>
            </Link>
            <p className="text-dark-400 text-sm mb-6 max-w-xs">
              AI-powered code reviews that help teams ship better code faster.
            </p>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.target}
                  rel={social.rel}
                  onClick={social.onClick}
                  className="text-dark-400 hover:text-primary-500 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <a 
              href="mailto:codequality01@gmail.com" 
              className="text-sm text-dark-400 hover:text-white transition-colors duration-200"
            >
              codequality01@gmail.com
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.target || '_self'}
                      rel={link.rel || ''}
                      className="text-dark-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-dark-400 text-sm">
            {new Date().getFullYear()} Code Quality. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
