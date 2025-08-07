import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Phone,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
} from 'lucide-react';
import Wave from '../../assets/images/icons/wave.svg';
import footerLogo from '../../assets/images/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0c2c59] text-slate-100 relative overflow-hidden">
      {/* Email Subscribe */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex justify-start"> <div className="relative w-full md:w-[40%]">
        <input type="email" placeholder="Email Address" className="w-full px-6 py-3 pr-36 text-base rounded-full text-slate-700 placeholder-slate-500 outline-none" />
        <button className="absolute right-1 top-1 bottom-1 bg-secondary hover:bg- text-slate-900 font-bold px-6 rounded-full transition" >
          SUBSCRIBE
        </button>
      </div>
      </div>

      {/* Wave Divider */}
      <div
        className="w-full h-6"
        style={{
          backgroundImage: `url(${Wave})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
        }}
      />

      {/* Footer Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <img src={footerLogo} alt="Logo" className="mb-4 w-28 h-auto" />
          <p className="text-slate-300 text-sm leading-relaxed">
            With our Aabetahura wallet, customers can easily manage their account by topping up their balance, eliminating the need to have cash on hand for every delivery. This convenient digital solution also allows users to pay for water subscriptions for friends and family, making it a perfect gift. Our water quality is exceptional, with a TDS level below 150 ppm, which is considered in the excellent range. Its anti-scale properties can help reduce the chances of kidney stone formation, and its zero turbidity means your kidneys have less work to do. We ensure safety through a purification process using UV rays and ozonation to minimize bacterial growth, and we only use food-grade bottles to maintain the water's purity.
          </p>
        </div>

        {/* About Us */}
        <div>
          <h4 className="text-lg font-semibold border-b-2 border-secondary inline-block mb-4">
            About Us
          </h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about" className="hover:text-secondary transition">Why Choose Us</Link></li>
            <li><Link to="/products" className="hover:text-secondary transition">Free Water Bottles</Link></li>
            <li><Link to="/contact" className="hover:text-secondary transition">Contact Us</Link></li>
            <li><Link to="/terms" className="hover:text-secondary transition">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-secondary transition">Privacy & Policy</Link></li>
          </ul>
        </div>

        {/* Business Hours */}
        <div>
          <h4 className="text-lg font-semibold border-b-2 border-secondary inline-block mb-4">
            Business Hours
          </h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Monday–Friday: 9am to 5pm</li>
            <li>Saturday: 10am to 4pm</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-lg font-semibold border-b-2 border-secondary inline-block mb-4">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1" />
              <a
                href="https://www.google.com/maps?ll=33.687527,73.224985&z=16&t=m&hl=en&gl=US&mapclient=embed&cid=16322839347137715683"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition cursor-pointer"
              >
                Jagiot Road Near Bheria Enclave<br />
                ISLAMABAD
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href='tel:+923346977744'>+92-334-6977744</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href='mailto:aabetahura@gmail.com'>aabetahura@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 pb-8">
        <Twitter className="w-5 h-5 hover:text-accent cursor-pointer" />
        <Facebook className="w-5 h-5 hover:text-accent cursor-pointer" />
        <Linkedin className="w-5 h-5 hover:text-accent cursor-pointer" />
        <Youtube className="w-5 h-5 hover:text-accent cursor-pointer" />
      </div>
      {/* Copyright Section */}
      <div className="text-center text-sm text-slate-400 py-4 border-t border-slate-700">
        &copy; {new Date().getFullYear()} Uaques. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

