import { createSignal, onCleanup, onMount } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';
import type { UnlistenFn } from '@tauri-apps/api/event';

import { feedSize, sidebar } from 'models/size';
import focus from 'models/focus';

import FeedDetailHeader from './FeedDetailHeader';

interface Props {
  ref?: HTMLDivElement;
  children: any;
}

export default function FeedDetail(p: Props) {
  const [totalWidth, setTotalWidth] = createSignal(window.innerWidth);
  let unsubResize: UnlistenFn;

  onMount(async () => {
    unsubResize = await appWindow.onResized(({ payload }) => {
      setTotalWidth(payload.width);
    });
  });

  onCleanup(() => {
    unsubResize?.();
  });

  const size = () => `${totalWidth() - feedSize[0]() - sidebar[0]()}px`;

  return (
    <div class="relative flex-auto overflow-x-hidden" classList={{ 'opacity-50': !focus() }} style={{ 'max-width': size() }}>
      <FeedDetailHeader />
      <div
        ref={p.ref}
        class="p-4 overflow-y-auto overflow-x-hidden bg-stone-800"
        style={{ 'max-height': 'calc(100vh - 3rem)', 'min-height': 'calc(100vh - 3rem)', 'border-bottom-right-radius': '12px' }}
      >
        {p.children}
      </div>
    </div>
  );
}
