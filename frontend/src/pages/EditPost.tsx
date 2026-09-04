import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Business', 'Health', 'Education', 'Other'];

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string;
}

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await postService.getPostById(id);
        if (res.success && res.data) {
          const p = res.data;
          reset({
            title: p.title,
            content: p.content,
            excerpt: p.excerpt,
            coverImage: p.coverImage || '',
            category: p.category,
            tags: p.tags?.join(', ') || '',
          });
        }
      } catch {
        toast.error('Failed to load post');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, reset, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        coverImage: data.coverImage || undefined,
      };
      const res = await postService.updatePost(id, payload);
      if (res.success) {
        toast.success('Post updated!');
        navigate(`/posts/${id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Edit Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label">Title</label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
            className="input"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Excerpt</label>
          <textarea
            {...register('excerpt', { required: 'Excerpt is required', maxLength: { value: 300, message: 'Max 300 characters' } })}
            rows={2}
            className="input"
          />
          {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="label">Content</label>
          <textarea
            {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Min 10 characters' } })}
            rows={12}
            className="input font-mono text-sm"
          />
          {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select {...register('category', { required: true })} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Cover Image URL</label>
            <input {...register('coverImage')} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Tags (comma-separated)</label>
          <input {...register('tags')} className="input" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
