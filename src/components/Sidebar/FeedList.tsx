import { For } from 'solid-js';

import menu from 'models/menu';

import FeedSection from './FeedSection';


export default function FeedList() {
  return (
    <div class="px-3 pb-8 text-gray-300 select-none">
      <For each={menu()}>
        {(item) => <FeedSection {...item} />}
      </For>
    </div>
  );
}
