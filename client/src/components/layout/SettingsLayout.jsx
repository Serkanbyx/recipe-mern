import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  User,
  Shield,
  Palette,
  Lock,
  ChevronDown,
} from 'lucide-react';

const settingsSections = [
  { to: '/settings', label: 'Profile', icon: User, end: true },
  { to: '/settings/account', label: 'Account', icon: Shield },
  { to: '/settings/appearance', label: 'Appearance', icon: Palette },
  { to: '/settings/privacy', label: 'Privacy', icon: Lock },
];

const sidebarLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950'
      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-orange-400 dark:hover:bg-gray-800'
  }`;

const SettingsLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const activeSection = settingsSections.find(
    (section) =>
      section.end
        ? location.pathname === section.to
        : location.pathname.startsWith(section.to)
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-56 lg:w-64 shrink-0">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Settings
        </h2>
        <nav className="space-y-1">
          {settingsSections.map(({ to, label, icon, end }) => {
            const Icon = icon;
            return (
              <NavLink key={to} to={to} end={end} className={sidebarLinkClass}>
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Settings
        </h2>
        <div className="relative">
          <button
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
            aria-expanded={isMobileNavOpen}
          >
            <span className="flex items-center gap-2">
              {activeSection && <activeSection.icon className="w-4 h-4" />}
              {activeSection?.label || 'Select section'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isMobileNavOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isMobileNavOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20">
              {settingsSections.map(({ to, label, icon, end }) => {
                const Icon = icon;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
