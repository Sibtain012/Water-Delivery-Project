import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-24 sm:h-28 md:h-32 lg:h-36 object-contain"
            />
          </Link>

          {/* Center: Delivery Text */}
          <div className="hidden lg:flex items-center bg-accent rounded-lg px-3 lg:px-4 py-2 shadow-sm">
            <span className="text-text text-xs lg:text-sm">Get Free Delivery</span>
            <a href="tel:+92334-697774" className="ml-2 text-base lg:text-lg font-semibold text-secondary hover:text-primary transition-colors">+92 334 697774</a>
          </div>

          {/* Right: Nav + Icons */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <nav className="hidden md:flex gap-4 lg:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-xs lg:text-sm font-medium uppercase tracking-wide transition-colors ${isActive(item.href)
                    ? 'text-black-600 border-b-2 border-accent'
                    : 'text-text hover:text-secondary'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Login Button */}
            <a
              href="https://customerportalaabetahura.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center px-3 lg:px-4 py-2 bg-primary text-white rounded-full text-xs lg:text-sm font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              <User className="w-4 h-4 mr-1" />
              Login
            </a>

            <button
              onClick={toggleCart}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary text-text flex items-center justify-center shadow-md hover:bg-accent transition-colors"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-background text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-2xs sm:text-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/90 transition-colors"
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg px-4 py-6 nav-mobile">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-link-mobile text-text font-medium transition-colors hover:text-secondary hover:bg-secondary/10 px-4 py-3 rounded-lg ${isActive(item.href) ? 'text-secondary bg-secondary/10' : ''
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Login Button */}
              <a
                href="https://customerportalaabetahura.shop/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="nav-link-mobile text-text font-medium transition-colors hover:text-secondary hover:bg-secondary/10 px-4 py-3 rounded-lg flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Customer Login
              </a>
            </nav>

            {/* Mobile Contact Info */}
            <div className="mt-6 pt-4 border-t border-text/10">
              <div className="flex items-center justify-center bg-accent/20 rounded-lg px-4 py-3">
                <span className="text-text text-sm">Get Free Delivery</span>
                <a href="tel:+8120703692" className="ml-2 text-base font-semibold text-secondary">
                  812-070-3692
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;