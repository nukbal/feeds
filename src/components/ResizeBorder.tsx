interface Props {
  onSizeChange: (delta: number) => void;
}

export default function ResizeBorder(p: Props) {
  let isHold = false;

  const handleMove = (e: MouseEvent) => {
    if (isHold === false) return;
    const delta = e.movementX;
    p.onSizeChange(delta * 1.85);
  };

  const handleMouseUp = () => {
    isHold = false;
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMove);
  };

  const handleDown = () => {
    isHold = true;

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMove);
  };

  return (
    <div
      class="absolute inset-y-0 right-0 bg-stone-900 hover:cursor-col-resize hover:bg-stone-500"
      style={{ width: '1.5px' }}
      onPointerDown={handleDown}
    />
  );
}
