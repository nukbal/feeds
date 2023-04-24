import { For } from 'solid-js';

import focus from 'models/focus';
import menu from 'models/menu';

import FeedSection from './FeedSection';


export default function FeedList() {
  return (
    <div class={`px-3 pb-8 text-gray-300 select-none ${focus() ? '' : 'opacity-40'}`}>
      <For each={menu()}>
        {(item) => <FeedSection {...item} />}
      </For>
    </div>
  );
}
