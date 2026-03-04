import React from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'
import Logo from '../common/Logo'

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4">
              <Logo showText size="md" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivering happiness to your doorstep. Fresh, fast, and delicious food from the best restaurants near you.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: FiFacebook, href: '#' },
                { Icon: FiTwitter, href: '#' },
                { Icon: FiInstagram, href: '#' },
                { Icon: FiYoutube, href: '#' }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: 'Home', to: '/' },
                { label: 'Restaurants', to: '/restaurants' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Help & Support', to: '/help' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: 'About Us', to: '#' },
                { label: 'Careers', to: '#' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
                { label: 'Cookie Policy', to: '#' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@tastyhome.in</li>
              <li>📞 1800-123-4567 (Toll Free)</li>
              <li>📍 Mumbai, Maharashtra, India</li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 bg-green-700 text-green-100 text-xs px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  Support 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TastyHome. All rights reserved. Made with ❤️ in India.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
