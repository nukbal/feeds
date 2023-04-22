import { Show } from 'solid-js';
import { IoRefresh, IoChevronBack, IoChevronForward } from 'solid-icons/io';

interface Props {
  title: string;
  total: number;
  loading?: boolean;
  page: number;
  onRefresh?: (num: number) => void;
}

export default function FeedHeader(p: Props) {
  return (
    <div
      class="relative flex flex-none items-center h-12 px-3 w-full justify-between border-b border-stone-900 bg-stone-700 drop-shadow-lg"
      data-tauri-drag-region
    >
      <div class="flex flex-col justify-center select-none">
        <h3 class="font-medium text-sm m-0 p-0 leading-none cursor-default focus:cursor-default">{p.title}</h3>
        <p class="text-xs leading-none cursor-default focus:cursor-default">
          <Show when={p.total}><span class="mr-2">{p.total} items</span></Show>
          <span>page {p.page + 1}</span>
        </p>
      </div>
      <div class="space-x-2">
        <Show when={p.page > 0}>
          <button class="px-2 py-1.5 hover:bg-gray-400/40 rounded leading-none" onClick={() => p.onRefresh?.(p.page - 1)}>
            <IoChevronBack size="20" />
          </button>
        </Show>
        <button class="px-2 py-1.5 hover:bg-gray-400/40 rounded leading-none" onClick={() => p.onRefresh?.(p.page + 1)}>
          <IoChevronForward size="20" />
        </button>
        <button class="px-2 py-1.5 hover:bg-gray-400/40 rounded leading-none" onClick={() => p.onRefresh?.(0)}>
          <IoRefresh size="20" />
        </button>
      </div>
    </div>
  );
}
