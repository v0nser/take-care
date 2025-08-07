import React from 'react';
import { Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/', icon: Twitter },
  { name: 'Facebook', href: 'https://facebook.com/', icon: Facebook },
  { name: 'Linkedin', href: 'https://linkedin.com/', icon: Linkedin },
  { name: 'Github', href: 'https://github.com/', icon: Github },
];

const Footer = () => {
  return (
    <footer className="relative z-20 w-full font-inter">
      <div className="bg-gradient-to-br from-white/80 via-blue-50/80 to-purple-50/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-bold text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">TakeCare</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Empowering Modern Healthcare</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-6 justify-center md:justify-start">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-4 justify-center md:justify-end">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700/30 shadow hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200"
                aria-label={name}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-white/20 dark:border-slate-700/50 py-6 px-6 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TakeCare. All rights reserved. &nbsp;|&nbsp;
          <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 underline transition-colors">Privacy Policy</a>
          &nbsp;|&nbsp;
          <a href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 underline transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 