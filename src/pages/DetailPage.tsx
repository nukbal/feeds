import { createResource, For, Show, createEffect } from 'solid-js';
import { useParams, useSearchParams } from '@solidjs/router';
import { invoke } from '@tauri-apps/api';
import { IoLinkOutline } from 'solid-icons/io';

import CommentItem from 'components/FeedDetail/Comment';
import Content from 'components/FeedDetail/Content';
import Loading from 'components/FeedDetail/Loading';
import Time from 'components/Atoms/Time';
import CommentNum from 'components/Atoms/CommentNum';
import LabelWithIcon from 'components/Atoms/LabelWithIcon';
import title from 'models/title';

function fetcher([name, id, subId]: string[]) {
  return invoke<FeedDetailType>('load_detail', { input: { name, id, sub: subId || null } });
}

const setTitle = title[1];

export default function FeedDetailPage() {
  const param = useParams();
  const [search] = useSearchParams();
  const [data] = createResource(() => [param.feed, param.id, search.subId], fetcher);

  createEffect(() => {
    const d = data();
    if (!d) return;
    setTitle(d.title);
  });

  return (
    <>
      <Show when={!data.loading}>
        <header class="pb-4 mb-4">
          <h2 class="text-2xl font-medium mb-1">{data()?.title}</h2>
          <div class="flex items-center text-gray-500 text-xs space-x-1.5 pl-1">
            <span class="">{data()?.author ?? '-'}</span>
            <Time date={data()?.createdAt} />
          </div>
        </header>
        <hr class="my-8 mx-32 border-gray-400/20" />
        <div>
          <Show when={data()?.url}>
            {url => (
              <LabelWithIcon Icon={IoLinkOutline} class="mt-1 pl-1 min-w-0">
                <a href={url()} target="_blank" class="inline-block truncate underline text-blue-500 max-w-xl">{url()}</a>
              </LabelWithIcon>
            )}
          </Show>
          <For each={data()?.contents}>
            {(item) => <Content data={item} />}
          </For>
        </div>
        <hr class="my-8 mx-32 border-gray-400/20" />
        <footer class="mb-8">
          <Show when={data()?.comments.filter((item) => item.isBest).length}>
            <h5 class="text-slate-500 font-medium tracking-tight pb-1">BEST</h5>
            <ul class="rounded bg-slate-400/5 py-2 mb-4 outline outline-slate-600 outline-offset-1">
              <For each={data()?.comments.filter((item) => item.isBest)}>
                {(item) => <CommentItem data={item} />}
              </For>
            </ul>
          </Show>
          <ul>
            <For each={data()?.comments}>
              {(item) => <CommentItem data={item} />}
            </For>
          </ul>
        </footer>
      </Show>
      <Show when={data.loading}>
        <Loading />
      </Show>
    </>
  );
}
