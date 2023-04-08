import { Setter } from 'solid-js';

interface Props {
  onSizeChange: Setter<number>;
  max: number;
  min: number;
}

export default function ResizeBorder(p: Props) {
  return (
    <div
      class="absolute inset-y-0 right-0 bg-stone-900 hover:cursor-col-resize hover:bg-stone-500"
      style={{ width: '1px' }}
    />
  );
}
