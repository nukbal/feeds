import { createResource, For, Show, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { invoke } from '@tauri-apps/api';
import { IoLinkOutline } from 'solid-icons/io';

import CommentItem from 'components/FeedDetail/Comment';
import Time from 'components/Atoms/Time';
import CommentNum from 'components/Atoms/CommentNum';
import LabelWithIcon from 'components/Atoms/LabelWithIcon';
import title from 'models/title';

function fetcher([name, id]: string[]) {
  return invoke<FeedDetailType>('load_detail', { input: { name, id } });
}

const setTitle = title[1];

export default function FeedDetailPage() {
  const param = useParams();
  const [data] = createResource(() => [param.feed, param.id], fetcher, { deferStream: true });

  createEffect(() => {
    const d = data();
    if (!d) return;
    setTitle(d.title);
  });

  return (
    <Show when={!data.loading}>
      <header class="pb-4 mb-4">
        <h2 class="text-2xl font-medium mb-1">{data()?.title}</h2>
        <div class="flex items-center text-gray-500 text-xs space-x-1.5 pl-1">
          <span class="">{data()?.author}</span>
          <Time date={data()?.createdAt} />
        </div>
        <Show when={data()?.url}>
          {url => (
            <LabelWithIcon Icon={IoLinkOutline} class="mt-1 pl-1">
              <a href={url()} target="_blank" class="underline text-blue-500">{url()}</a>
            </LabelWithIcon>
          )}
        </Show>
      </header>
      <div>
        <For each={data()?.contents}>
          {(item) => <p>{item.text}</p>}
        </For>
      </div>
      <footer class="mb-8">
        <ul>
          <For each={data()?.comments}>
            {(item) => <CommentItem data={item} />}
          </For>
        </ul>
      </footer>
    </Show>
  );
}
