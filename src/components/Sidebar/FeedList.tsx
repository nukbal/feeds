import { NavLink } from '@solidjs/router';

import focus from 'models/focus';

export default function FeedList() {
  return (
    <div class={`px-3 pb-8 text-gray-300 select-none ${focus() ? '' : 'opacity-40'}`}>
      <h3 class="cursor-default text-sm">
        <span class="font-medium opacity-60 tracking-tight">Feeds</span>
        <div class="flex flex-col">
          <NavLink href="/feeds/hacker_news" class="p-1 rounded" activeClass="bg-gray-500/50">
            HackerNews
          </NavLink>
        </div>
      </h3>
    </div>
  );
}
