import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { postService } from '../services/postService';
import { Post, Pagination } from '../types';
import PostCard from '../components/posts/PostCard';
import PostSkeleton from '../components/posts/PostSkeleton';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Business', 'Health', 'Education', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await postService.getPosts({
          page,
          limit: 9,
          search: search || undefined,
          category: category !== 'All' ? category : undefined,
          sort,
        });
        if (res.success && res.data) {
          setPosts(res.data.posts);
          setPagination(res.data.pagination);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetch, 300);
    return () => clearTimeout(timer);
  }, [page, search, category, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Explore Posts</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts..."
            className="input pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="input w-full sm:w-40"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="input w-full sm:w-40"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">No posts found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline"
              >
                Previous
              </button>
              <span className="px-4 text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
