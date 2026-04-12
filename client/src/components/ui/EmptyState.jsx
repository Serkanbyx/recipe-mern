import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      {message && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {message}
        </p>
      )}

      {action && (
        <Link
          to={action.to}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 rounded-lg transition-colors"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
