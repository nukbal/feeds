import { Show } from 'solid-js';
import { IoRefresh, IoChevronBack, IoChevronForward } from 'solid-icons/io';

interface Props {
  title: string;
  total: number;
  loading?: boolean;
  page: number;
  last?: boolean;
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
        <p class="text-xs leading-none cursor-default mt-0.5 focus:cursor-default">
          <span class="mr-1">page {p.page + 1}</span>
          <Show when={p.total}><span>| {p.total} items</span></Show>
        </p>
      </div>
      <div class="space-x-2">
        <Show when={p.page > 0}>
          <button class={buttonStyle} onClick={() => p.onRefresh?.(p.page - 1)} disabled={p.loading}>
            <IoChevronBack size="20" />
          </button>
        </Show>
        <Show when={!p.last}>
          <button class={buttonStyle} onClick={() => p.onRefresh?.(p.page + 1)} disabled={p.loading}>
            <IoChevronForward size="20" />
          </button>
        </Show>
        <button class={buttonStyle} onClick={() => p.onRefresh?.(0)} disabled={p.loading}>
          <IoRefresh size="20" />
        </button>
      </div>
    </div>
  );
}

const buttonStyle = 'px-2 py-1.5 enabled:hover:bg-gray-400/40 rounded leading-none disabled:opacity-20';
