import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-primary-500">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
