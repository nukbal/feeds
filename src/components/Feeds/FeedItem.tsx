import { NavLink } from '@solidjs/router';

import Time from 'components/Atoms/Time';
import CommentNum from 'components/Atoms/CommentNum';

interface Props {
  item: FeedItemType;
}

export default function FeedItem({ item }: Props) {
  return (
    <NavLink
      class="block p-4 pb-0 rounded"
      href={`read/${item.id}`}
      state={item}
      activeClass="bg-blue-600"
      inactiveClass="hover:bg-slate-700"
    >
      <div class="relative pb-4">
        <h3 class="leading-5 tracking-tighter font-medium">{item.title}</h3>
        <span class={`truncate overflow-hidden leading-none tracking-tighter text-sm`}>
          {item.url}
        </span>
        <div class="flex flex-row items-center leading-none justify-between">
          <span class="text-sm">{item.author}</span>
          <div class="flex flex-row items-center">
            {item.comments !== null ? <CommentNum class="mr-1" count={item.comments} /> : null}
            <Time date={item.createdAt} />
          </div>
        </div>
        {/* {!isActive ? <div class="absolute inset-x-0 bottom-0 bg-slate-700" style={{ height: 1 }} /> : null} */}
      </div>
    </NavLink>
  );
}
