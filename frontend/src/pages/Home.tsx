import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, ArrowRight } from 'lucide-react';
import { postService } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/posts/PostCard';
import PostSkeleton from '../components/posts/PostSkeleton';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await postService.getPosts({ limit: 6, sort: 'newest' });
        if (res.success && res.data) setPosts(res.data.posts);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Share your ideas.
            <br />
            Inspire others.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
            A modern blogging platform where writers connect, share knowledge, and grow together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/create-post" className="btn bg-white text-primary-700 hover:bg-primary-50">
                <PenSquare className="h-4 w-4" />
                Start Writing
              </Link>
            ) : (
              <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50">
                Get Started
              </Link>
            )}
            <Link to="/explore" className="btn border border-white/30 text-white hover:bg-white/10">
              Explore Posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
          <Link to="/explore" className="text-sm font-medium text-primary-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-500">No posts yet. Be the first to write!</p>
            {isAuthenticated && (
              <Link to="/create-post" className="btn-primary mt-4 inline-flex">
                Create Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
