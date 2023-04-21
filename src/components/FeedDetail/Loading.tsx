export default function FeedDetailLoading() {
  return (
    <div class="animate-pulse">
      <header class="pb-4 mb-4">
        <h2 class="text-2xl font-medium mb-1">
          <span class="inline-block h-6 w-72 bg-stone-700 rounded" />
        </h2>
        <div class="flex items-center text-gray-500 text-xs space-x-1.5">
          <span class="inline-block h-4 w-32 bg-stone-700 rounded" />
        </div>
      </header>
      <hr class="my-8 mx-32 border-gray-400/20" />
      <div class="py-4 space-y-2">
        <div class="block h-4 w-32 bg-stone-700 rounded" />
        <div class="block h-4 w-64 bg-stone-700 rounded" />
        <div class="block h-4 w-72 bg-stone-700 rounded" />
      </div>
      <hr class="my-8 mx-32 border-gray-400/20" />
    </div>
  );
}
