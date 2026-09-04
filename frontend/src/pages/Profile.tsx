import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { postService } from '../services/postService';
import { Post } from '../types';
import { formatDate } from '../utils/helpers';
import PostCard from '../components/posts/PostCard';
import PostSkeleton from '../components/posts/PostSkeleton';

export default function Profile() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const res = await postService.getPostsByAuthor(user._id);
        if (res.success && res.data) setPosts(res.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="card mb-10 p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
              {user.name[0]}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="mt-1 text-sm text-gray-400">
              Joined {formatDate(user.createdAt)} · {posts.length} posts
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Link to="/create-post" className="btn-primary">
                Write New Post
              </Link>
              <Link to="/my-posts" className="btn-outline">
                Manage Posts
              </Link>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-xl font-semibold">Your Posts</h2>
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
          <p className="text-gray-500">You haven't written any posts yet.</p>
          <Link to="/create-post" className="btn-primary mt-4 inline-flex">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
