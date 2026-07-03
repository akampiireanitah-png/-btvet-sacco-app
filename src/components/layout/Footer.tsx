import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Send, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
                BS
              </div>
              <div>
                <div className="font-bold text-white text-sm">BTVET Teachers</div>
                <div className="text-xs text-slate-400">SACCO Business Centre</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering BTVET teachers through a cooperative business platform for goods, services, and financial solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm hover:text-brand-400 transition-colors">Shop Products</Link></li>
              <li><Link to="/services" className="text-sm hover:text-brand-400 transition-colors">Book Services</Link></li>
              <li><Link to="/sacco" className="text-sm hover:text-brand-400 transition-colors">SACCO Account</Link></li>
              <li><Link to="/orders" className="text-sm hover:text-brand-400 transition-colors">Track Orders</Link></li>
              <li><Link to="/admin" className="text-sm hover:text-brand-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-sm text-slate-400">School Supplies & Equipment</li>
              <li className="text-sm text-slate-400">Groceries & Household Items</li>
              <li className="text-sm text-slate-400">Financial Services & Loans</li>
              <li className="text-sm text-slate-400">Business Training Programs</li>
              <li className="text-sm text-slate-400">Printing & Document Services</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-brand-400" />
                <span>BTVET SACCO Headquarters, Kampala, Uganda</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="flex-shrink-0 text-brand-400" />
                <span>+256 414 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="flex-shrink-0 text-brand-400" />
                <span>info@btvetsacco.ac.ug</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {[Globe, Send, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BTVET Teachers SACCO Business Centre. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-400 transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
