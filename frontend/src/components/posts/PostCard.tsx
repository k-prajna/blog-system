import { Link } from 'react-router-dom';
import { MessageCircle, Eye, Clock } from 'lucide-react';
import { Post } from '../../types';
import { formatDate, readingTime } from '../../utils/helpers';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <article className="card overflow-hidden">
      {post.coverImage && (
        <Link to={`/posts/${post._id}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            {post.category}
          </span>
        </div>
        <Link to={`/posts/${post._id}`}>
          <h3 className="mb-2 text-lg font-semibold leading-snug text-gray-900 hover:text-primary-600 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                {post.author?.name?.[0]}
              </div>
            )}
            <span>{post.author?.name}</span>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime(post.content)} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.views}
            </span>
            {post.commentCount !== undefined && (
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.commentCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
