import { Show, createSignal, createResource, createEffect, on } from 'solid-js';
import { Outlet, useParams } from '@solidjs/router';
import { invoke } from '@tauri-apps/api';

import Feeds from 'components/Feeds';
import FeedDetail from 'components/FeedDetail';
import ResizeBorder from 'components/ResizeBorder';
import { feed } from 'models/size';
import { px } from 'utils/unit';

interface LoadFeedType {
  items: FeedItemType[];
  page: number;
  total: number | null;
  totalPages: number| null;
  itemsPerPage: number;
  loadAt: number;
}

const listCache = new Map<string, LoadFeedType>();

async function fetcher([name, page]: Array<string | number>) {
  const key = [name, page].join('_');
  const cache = listCache.get(key);

  if (Date.now() - (listCache.get(key)?.loadAt || 0) < 15_000) return cache;

  const res = await invoke<LoadFeedType>('load_feeds', { input: { name, page } });
  res.loadAt = Date.now();

  listCache.set(key, res);

  return res;
}

export default function ListOutlet() {
  const params = useParams();
  const [page, setPage] = createSignal(0);
  const [size, setSize] = feed;

  const [data, { refetch, mutate }] = createResource(() => [params.feed, page()], fetcher);

  createEffect((prev) => {
    if (params.feed !== prev) {
      mutate({ items: [], page: 0, total: null, totalPages: null, itemsPerPage: 0, loadAt: 0 });
    }
  }, params.feed);

  const handleRequest = async (nextNum: number = 0) => {
    setPage(nextNum);
    if (nextNum === 0) {
      const res = await refetch();
      if (res) mutate(() => res);
    }
  };

  return (
    <>
      <div class="relative" style={{ width: px(size()), 'min-width': px(size()) }}>
        <Show when={data() !== undefined}>
          <Feeds
            title={FEED_TITLE[params.feed!] || 'All Inbox'}
            total={data()?.total ?? 0}
            items={data()?.items ?? []}
            onRequest={handleRequest}
          />
        </Show>
        <ResizeBorder onSizeChange={setSize} max={450} min={300} />
      </div>
      <FeedDetail>
        <Outlet />
      </FeedDetail>
    </>
  );
}

const FEED_TITLE = {
  hacker_news: 'Hacker News',
  ruliweb: '루리웹 - 베스트',
} as { [key: string]: string };
