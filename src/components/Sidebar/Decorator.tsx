import { createSignal } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';
import { IoClose, IoRemove, IoExpand } from 'solid-icons/io';

import focus from 'models/focus';

const buttonClass = 'flex items-center justify-center rounded-full w-3 h-3 text-black';

export default function Decorator() {
  const [hover, setHover] = createSignal(false);

  const isUnFocused = () => !focus() && !hover();

  return (
    <div class="absolute flex items-center h-12 pl-4 pb-1" data-tauri-drag-region>
      <div class="flex space-x-2" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <button
          class={`${buttonClass} ${isUnFocused() ? 'bg-gray-400' : 'bg-red-400'}`}
          onClick={appWindow.close}
        >
          {hover() ? <IoClose size={12} /> : null}
        </button>
        <button
          class={`${buttonClass} ${isUnFocused() ? 'bg-gray-400' : 'bg-amber-400'}`}
          onClick={appWindow.minimize}
        >
          {hover() ? <IoRemove size={12} /> : null}
        </button>
        <button
          class={`${buttonClass} ${isUnFocused() ? 'bg-gray-400' : 'bg-green-400'}`}
          onClick={appWindow.toggleMaximize}
        >
          {hover() ? <IoExpand size={8} /> : null}
        </button>
      </div>
    </div>
  );
}
