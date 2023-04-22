import { Show } from 'solid-js';

import Time from 'components/Atoms/Time';
import CommentNum from 'components/Atoms/CommentNum';

import Link from './FeedNavLink';

interface Props {
  item: FeedItemType;
}

export default function FeedItem({ item }: Props) {
  return (
    <Link id={item.id} subId={item.subId}>
      <Show when={item.thumb}>
        {(thumb) => (
          <figure
            class="absolute left-4 top-4 h-16 w-16 bg-stone-700 bg-cover bg-center rounded"
          >
            <img src={thumb()} class="object-cover h-16 w-16 rounded" loading="lazy" />
          </figure>
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
          <span class="text-sm">{countChar(item.author) > 14 ? `${substring(item.author, 14)}...` : item.author}</span>
          <div class="flex flex-row items-center">
            {item.comments !== null ? <CommentNum class="mr-1" count={item.comments} /> : null}
            <Time date={item.createdAt} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function countChar(str: string) {
  let count = 0;
  for (let i = 0; i < str.length; i += 1) {
    count += str.charAt(i).charCodeAt(0) < 128 ? 1 : 2;
  }
  return count;
}

function substring(str: string, max: number) {
  let text = '';
  let count = max;
  for (let i = 0; i < str.length; i += 1) {
    if (count < 0) break;
    const char = str.charAt(i);
    const charCount = char.charCodeAt(0) < 128 ? 1 : 2;
    count -= charCount;
    text += char;
  }
  return text;
}
