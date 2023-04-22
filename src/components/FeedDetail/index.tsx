import FeedDetailHeader from './FeedDetailHeader';

interface Props {
  ref?: HTMLDivElement;
  children: any;
}

export default function FeedDetail(p: Props) {
  return (
    <div class="relative flex-auto overflow-x-hidden">
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
