import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold tracking-tight text-primary-500">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="rounded-lg bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Go Home
        </Link>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
