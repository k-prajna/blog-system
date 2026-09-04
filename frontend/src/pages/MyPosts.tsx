import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { postService } from '../services/postService';
import { Post } from '../types';
import { formatDate, readingTime } from '../utils/helpers';

export default function MyPosts() {
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
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await postService.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
        <Link to="/create-post" className="btn-primary">
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse p-5">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">No posts yet.</p>
          <Link to="/create-post" className="btn-primary mt-4 inline-flex">
            Create Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <Link to={`/posts/${post._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(post.createdAt)} · {readingTime(post.content)} min · {post.views} views ·{' '}
                  {post.category}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/edit-post/${post._id}`} className="btn-outline">
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                <button onClick={() => handleDelete(post._id)} className="btn-danger">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
