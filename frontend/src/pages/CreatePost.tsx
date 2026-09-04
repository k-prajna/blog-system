import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

export default function CreatePost() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { category: 'Technology', coverImage: '', tags: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        coverImage: data.coverImage || undefined,
      };
      const res = await postService.createPost(payload);
      if (res.success && res.data) {
        toast.success('Post published!');
        navigate(`/posts/${res.data._id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Create New Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label">Title</label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
            className="input"
            placeholder="Enter post title"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Excerpt</label>
          <textarea
            {...register('excerpt', { required: 'Excerpt is required', maxLength: { value: 300, message: 'Max 300 characters' } })}
            rows={2}
            className="input"
            placeholder="Short summary of your post"
          />
          {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="label">Content</label>
          <textarea
            {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Min 10 characters' } })}
            rows={12}
            className="input font-mono text-sm"
            placeholder="Write your post content here..."
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
            <input
              {...register('coverImage')}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div>
          <label className="label">Tags (comma-separated)</label>
          <input
            {...register('tags')}
            className="input"
            placeholder="react, typescript, webdev"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
