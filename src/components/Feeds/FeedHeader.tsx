import { IoRefresh } from 'solid-icons/io';

interface Props {
  title: string;
  total: number;
  onRefresh: () => void;
}

export default function FeedHeader(p: Props) {
  return (
    <div
      class="relative flex flex-none items-center h-12 px-3 w-full justify-between border-b border-stone-900 bg-stone-700 drop-shadow-lg"
      data-tauri-drag-region
    >
      <div class="flex flex-col justify-center select-none">
        <h3 class="font-medium text-sm m-0 p-0 leading-none cursor-default focus:cursor-default">{p.title}</h3>
        <small class="text-xs leading-none cursor-default focus:cursor-default">{p.total} items</small>
      </div>
      <button class="px-2 py-1.5 hover:bg-gray-600 rounded leading-none" onClick={p.onRefresh}>
        <IoRefresh size="20" />
      </button>
    </div>
  );
}
