import { createSignal, onCleanup } from 'solid-js';

interface Props {
  onSizeChange: (delta: number) => void;
}

export default function ResizeBorder(p: Props) {
  const [drag, setDrag] = createSignal(false);
  let isHold = false;

  const handleMove = (e: MouseEvent) => {
    if (isHold === false) return;
    const delta = e.movementX;
    p.onSizeChange(delta * 1.125);
  };

  const handleMouseUp = () => {
    isHold = false;
    setDrag(false);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMove);
  };

  const handleDown = () => {
    isHold = true;
    setDrag(true);

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMove);
  };

  onCleanup(() => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMove);
  });

  return (
    <div
      class="absolute inset-y-0 right-0 bg-stone-900 hover:cursor-col-resize"
      classList={{ 'bg-stone-300': drag(), 'hover:bg-stone-500': !drag() }}
      style={{ width: '1.25px' }}
      onPointerDown={handleDown}
      onPointerUp={handleMouseUp}
    />
  );
}
