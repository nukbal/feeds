import { createResource, For, Show, Switch, Match, createEffect } from 'solid-js';
import { useParams, useSearchParams } from '@solidjs/router';
import { invoke } from '@tauri-apps/api';
import { IoLinkOutline } from 'solid-icons/io';

import CommentItem from 'components/FeedDetail/Comment';
import FeedDetailEmpty from 'components/FeedDetail/Empty';
import Content from 'components/FeedDetail/Content';
import Link from 'components/FeedDetail/Content/Link';
import Loading from 'components/FeedDetail/Loading';
import Time from 'components/Atoms/Time';
import CommentNum from 'components/Atoms/CommentNum';
import LabelWithIcon from 'components/Atoms/LabelWithIcon';
import title from 'models/title';

async function fetcher([name, feed, id, subId]: string[]) {
  const data = await invoke<FeedDetailType>('load_detail', { input: { name, id, feed, sub: subId || null } });
  return data;
}

const setTitle = title[1];

export default function FeedDetailPage() {
  const param = useParams();
  const [search] = useSearchParams();
  const [data] = createResource(() => [param.name, param.feed, param.id, search.subId], fetcher);

  createEffect(() => {
    const d = data();
    if (!d) return;
    setTitle(d.title);
  });

  return (
    <Switch>
      <Match when={!data.loading}>
        <header class="pb-4 mb-4">
          <h2 class="text-2xl font-medium mb-1">{data()?.title}</h2>
          <div class="flex items-center text-gray-500 text-xs space-x-1.5 pl-1">
            <span class="">{data()?.author ?? '-'}</span>
            <Time date={data()?.createdAt} />
          </div>
        </header>
        <article class="mt-4">
          <Show when={data()?.url}>
            {url => (
              <LabelWithIcon Icon={IoLinkOutline} class="mt-1 pl-1 min-w-0">
                <Link url={url()} class="inline-block max-w-xl" />
              </LabelWithIcon>
            )}
          </Show>
          <For each={data()?.contents}>
            {(item) => <Content data={item} />}
          </For>
        </article>
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
      </Match>
      <Match when={data.error}>
        <FeedDetailEmpty />
      </Match>
      <Match when={data.loading}>
        <Loading />
      </Match>
    </Switch>
  );
}
