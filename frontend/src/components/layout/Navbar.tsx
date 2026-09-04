import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, PenSquare, LogOut, User, BookOpen, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-700">
          <BookOpen className="h-6 w-6" />
          <span>BlogPlatform</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">
            Home
          </Link>
          <Link to="/explore" className="text-sm font-medium text-gray-600 hover:text-primary-600">
            Explore
          </Link>
          {isAuthenticated && (
            <Link to="/my-posts" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              My Posts
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="btn-primary">
                <PenSquare className="h-4 w-4" />
                Write
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-1 hidden w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg group-hover:block">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium">
              Home
            </Link>
            <Link to="/explore" onClick={() => setOpen(false)} className="text-sm font-medium">
              Explore
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-posts" onClick={() => setOpen(false)} className="text-sm font-medium">
                  My Posts
                </Link>
                <Link to="/create-post" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Write Post
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
