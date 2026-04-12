import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span className="text-sm">
              &copy; {new Date().getFullYear()} RecipeApp. All rights reserved.
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              Privacy
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-500">
          Created by{' '}
          <a
            href="https://serkanbayraktar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
          >
            Serkanby
          </a>
          {' | '}
          <a
            href="https://github.com/Serkanbyx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
