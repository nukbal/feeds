import { For } from 'solid-js';

import FeedItem from './FeedItem';
import FeedHeader from './FeedHeader';
import FeedLoading from './FeedPlaceholder';

interface Props {
  ref?: HTMLUListElement;
  title: string;
  total: number;
  items: FeedItemType[];
  page: number;
  onRequest?: (page: number) => void;
}

export default function Feeds(props: Props) {
  return (
    <div class="flex flex-col min-h-screen select-none">
      <FeedHeader title={props.title} total={props.total} page={props.page} onRefresh={props.onRequest} />
      <ul
        ref={props.ref}
        class="block p-2 pr-1 pb-6 bg-stone-800 overflow-y-scroll overflow-x-hidden space-y-1"
        style={{ 'max-height': 'calc(100vh - 3rem)', 'min-height': 'calc(100vh - 3rem)' }}
      >
        <For each={props.items} fallback={<FeedLoading />}>
          {(item) => <FeedItem data-key={item.id} item={item} />}
        </For>
      </ul>
    </div>
  );
}
