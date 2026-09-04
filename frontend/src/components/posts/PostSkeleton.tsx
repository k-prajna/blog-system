export default function PostSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="h-48 w-full bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
