import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-primary-700">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">BlogPlatform</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BlogPlatform. Share your ideas.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/explore" className="hover:text-primary-600">
              Explore
            </Link>
            <Link to="/create-post" className="hover:text-primary-600">
              Write
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
