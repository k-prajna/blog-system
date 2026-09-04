import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Send } from 'lucide-react';
import { commentService } from '../../services/commentService';
import { useAuthStore } from '../../store/authStore';
import { Comment } from '../../types';
import { formatDate } from '../../utils/helpers';

interface Props {
  postId: string;
}

interface FormData {
  content: string;
}

export default function CommentSection({ postId }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>();

  const fetchComments = async () => {
    try {
      const res = await commentService.getComments(postId);
      if (res.success && res.data) setComments(res.data);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await commentService.createComment(postId, data.content);
      if (res.success && res.data) {
        setComments((prev) => [res.data!, ...prev]);
        reset();
        toast.success('Comment added');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await commentService.updateComment(id, editContent);
      if (res.success && res.data) {
        setComments((prev) => prev.map((c) => (c._id === id ? res.data! : c)));
        setEditingId(null);
        toast.success('Comment updated');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentService.deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-6 text-xl font-semibold">
        Comments ({comments.length})
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <textarea
            {...register('content', { required: true, minLength: 1 })}
            rows={3}
            placeholder="Write a comment..."
            className="input mb-3"
          />
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-gray-600">
            <Link to="/login" className="font-medium text-primary-600 hover:underline">
              Login
            </Link>{' '}
            to join the discussion
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              {comment.author?.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                  {comment.author?.name?.[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{comment.author?.name}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                {editingId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="input mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(comment._id)} className="btn-primary text-xs">
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary text-xs">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    {user && (user._id === comment.author?._id || user.role === 'admin') && (
                      <div className="mt-2 flex gap-3">
                        <button
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
