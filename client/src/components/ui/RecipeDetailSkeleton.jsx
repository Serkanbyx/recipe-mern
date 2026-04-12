const RecipeDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
    </div>

    {/* Hero Image */}
    <div className="w-full h-64 sm:h-80 lg:h-[400px] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />

    {/* Title Row */}
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>

    {/* Meta Bar */}
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
    </div>

    {/* Description */}
    <div className="space-y-2 mb-8">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    </div>

    {/* Ingredients */}
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-5 h-5 rounded border-2 border-gray-200 dark:border-gray-700 shrink-0" />
            <div
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              style={{ width: `${55 + (i % 3) * 15}%` }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Instructions */}
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-36" />
        <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                style={{ width: `${65 + (i % 2) * 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Author Card */}
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>
        <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
      </div>
    </div>
  </div>
);

export default RecipeDetailSkeleton;
