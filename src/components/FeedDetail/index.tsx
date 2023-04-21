import FeedDetailHeader from './FeedDetailHeader';

interface Props {
  children: any;
}

export default function FeedDetail({ children }: Props) {
  return (
    <div class="relative flex-auto overflow-x-hidden">
      <FeedDetailHeader />
      <div
        class="p-4 overflow-y-auto overflow-x-hidden bg-stone-800"
        style={{ 'max-height': 'calc(100vh - 3rem)', 'min-height': 'calc(100vh - 3rem)', 'border-bottom-right-radius': '12px' }}
      >
        {children}
      </div>
    </div>
  );
}
