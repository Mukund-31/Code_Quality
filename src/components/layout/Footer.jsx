import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
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
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    resources: [
      { name: 'Community', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Status', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookies', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Email', icon: Mail, href: '#' },
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
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-dark-400 hover:text-primary-500 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
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
            © {new Date().getFullYear()} Code Quality. All rights reserved.
          </p>
          <p className="text-dark-400 text-sm">
            Built with ❤️ using React & GSAP
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
