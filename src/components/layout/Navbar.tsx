
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Today', path: '/' },
    { name: 'History', path: '/history' },
    { name: 'Results', path: '/results' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <span className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                DailyQuiz
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                )}
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "block animate-fade-in" : "hidden animate-fade-out"
        } md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              )}
              aria-current={location.pathname === item.path ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <SignedOut>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-start">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full justify-start mt-2">Sign Up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
