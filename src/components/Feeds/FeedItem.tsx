import { Show } from 'solid-js';
import { NavLink } from '@solidjs/router';

import Time from 'components/Atoms/Time';
import CommentNum from 'components/Atoms/CommentNum';

interface Props {
  item: FeedItemType;
}

export default function FeedItem({ item }: Props) {
  return (
    <NavLink
      class="block p-4 rounded relative"
      href={`read/${item.id}?subId=${item.subId}`}
      state={item}
      activeClass="bg-blue-600"
      inactiveClass="hover:bg-slate-700"
    >
      <Show when={item.thumb}>
        {(thumb) => (
          <figure
            class="absolute left-4 top-4 h-16 w-16 bg-stone-700 bg-cover bg-center rounded"
            style={{ 'background-image': `url(${thumb()})` }}
          />
        )}
      </Show>
      <div class="relative" style={{ 'padding-left': item.thumb ? '4.5rem' : '0px' }}>
        <Show when={item.category}>
          {(category) => (
            <small class="block leading-none mb-2 text-sm tracking-tighter opacity-60">{category()}</small>
          )}
        </Show>
        <h3 class="block leading-5 tracking-tighter font-medium">{item.title}</h3>
        <p class="truncate overflow-hidden leading-none tracking-tighter text-sm opacity-60 py-2">
          {item.text}
        </p>
        <div class="flex flex-row items-center leading-none justify-between">
          <span class="text-sm">{item.author}</span>
          <div class="flex flex-row items-center">
            {item.comments !== null ? <CommentNum class="mr-1" count={item.comments} /> : null}
            <Time date={item.createdAt} />
          </div>
        </div>
      </div>
    </NavLink>
  );
}
