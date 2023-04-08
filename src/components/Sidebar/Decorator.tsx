import { createSignal } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';
import { IoClose, IoRemove, IoExpand } from 'solid-icons/io';

import focus from 'models/focus';

const buttonClass = 'flex items-center justify-center rounded-full w-3 h-3';

function getColorByState(disabled: boolean, activeColor: string) {
  if (!disabled) return `bg-${activeColor}-400`;
  return 'bg-gray-400 opacity-40';
}

export default function Decorator() {
  const [hover, setHover] = createSignal(false);

  const isUnFocused = () => !focus() && !hover();

  return (
    <div class="absolute flex items-center h-12 pl-4 pb-2" data-tauri-drag-region>
      <div class="flex space-x-2" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <button class={`${buttonClass} ${getColorByState(isUnFocused(), 'red')}`} onClick={appWindow.close}>
          {hover() ? <IoClose size={13} /> : null}
        </button>
        <button class={`${buttonClass} ${getColorByState(isUnFocused(), 'amber')}`} onClick={appWindow.minimize}>
          {hover() ? <IoRemove size={13} /> : null}
        </button>
        <button class={`${buttonClass} ${getColorByState(isUnFocused(), 'green')}`} onClick={appWindow.toggleMaximize}>
          {hover() ? <IoExpand size={10} /> : null}
        </button>
      </div>
    </div>
  );
}
