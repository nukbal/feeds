import { For } from 'solid-js';

import FeedItem from './FeedItem';
import FeedHeader from './FeedHeader';

interface Props {
  title: string;
  total: number;
  items: FeedItemType[];
  onRequest?: (page: number) => void;
}

export default function Feeds(props: Props) {
  return (
    <div class="flex flex-col min-h-screen select-none">
      <FeedHeader title={props.title} total={props.total} onRefresh={() => props.onRequest?.(0)} />
      <ul
        class="block p-2 pr-1 bg-stone-800 overflow-y-scroll overflow-x-hidden"
        style={{ 'max-height': 'calc(100vh - 3rem)', 'min-height': 'calc(100vh - 3rem)' }}
      >
        <For each={props.items}>
          {(item) => <FeedItem item={item} />}
        </For>
        <div class="p-4 text-center text-sm">
          <span>Loading...</span>
        </div>
      </ul>
    </div>
  );
}
