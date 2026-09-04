import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page not found</p>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
}
