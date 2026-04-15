export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto" />
        <div className="h-4 w-1/2 bg-gray-100 rounded mx-auto" />
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border border-jiro-border rounded-lg p-4 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
