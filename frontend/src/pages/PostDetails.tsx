import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Clock, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';
import { useAuthStore } from '../store/authStore';
import { Post } from '../types';
import { formatDate, readingTime } from '../utils/helpers';
import CommentSection from '../components/comments/CommentSection';

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await postService.getPostById(id);
        if (res.success && res.data) setPost(res.data);
      } catch {
        toast.error('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !confirm('Are you sure you want to delete this post?')) return;
    try {
      await postService.deletePost(post._id);
      toast.success('Post deleted');
      navigate('/explore');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-64 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-500">Post not found</p>
        <Link to="/explore" className="btn-primary mt-4 inline-flex">
          Back to Explore
        </Link>
      </div>
    );
  }

  const isOwner = user && (user._id === post.author?._id || user.role === 'admin');

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/explore" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to Blogs
      </Link>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="mb-8 h-64 w-full rounded-xl object-cover md:h-80"
        />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
          {post.category}
        </span>
        {post.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
        {post.title}
      </h1>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-medium text-primary-700">
              {post.author?.name?.[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{post.author?.name}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime(post.content)} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views} views
          </span>
        </div>
      </div>

      {isOwner && (
        <div className="mb-6 flex gap-2">
          <Link to={`/edit-post/${post._id}`} className="btn-outline">
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}

      <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>

      <CommentSection postId={post._id} />
    </article>
  );
}
