import { createSignal, createResource, createEffect } from 'solid-js';
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

async function fetcher([name, feed, page]: Array<string | number>) {
  const key = [name, feed, page].join('_');
  const cache = listCache.get(key);

  if (Date.now() - (listCache.get(key)?.loadAt || 0) < 30_000) return cache;

  const res = await invoke<LoadFeedType>('load_feeds', { input: { name, feed, page } });
  res.loadAt = Date.now();

  listCache.set(key, res);

  return res;
}

export default function ListOutlet() {
  const params = useParams();
  const [page, setPage] = createSignal(0);
  const [size, setSize] = feed;

  const [data, { mutate, refetch }] = createResource(() => [params.name, params.feed, page()], fetcher);

  let ref: HTMLUListElement | undefined;
  let detailRef: HTMLDivElement | undefined;

  createEffect((prev) => {
    ref?.scrollTo({ top: 0 });

    if (params.feed !== prev) {
      mutate({ items: [], page: 0, total: null, totalPages: null, itemsPerPage: 0, loadAt: 0 });
      setPage(0);
    }
  }, params.feed);

  createEffect((prev) => {
    if (params.id !== prev) {
      detailRef?.scrollTo({ top: 0, left: 0 });
    }
  }, params.id);

  const handleRequest = async (nextNum: number = 0) => {
    if (page() === nextNum) {
      await refetch();
    }
    setPage(nextNum);
    ref?.scrollTo({ top: 0 });
  };

  const handleWidthChange = (delta: number) => {
    setSize((prev) => {
      const nextVal = prev + delta;
      if (nextVal >= 450) return 450;
      if (nextVal <= 300) return 300;
      return nextVal;
    });
  };

  return (
    <>
      <div class="relative" style={{ width: px(size()), 'min-width': px(size()) }}>
        <Feeds
          ref={ref}
          title={FEED_TITLE[params.name!] || 'All Inbox'}
          total={data()?.total ?? 0}
          items={data()?.items ?? []}
          page={page()}
          onRequest={handleRequest}
        />
        <ResizeBorder onSizeChange={handleWidthChange} />
      </div>
      <FeedDetail ref={detailRef}>
        <Outlet />
      </FeedDetail>
    </>
  );
}

const FEED_TITLE = {
  hacker_news: 'Hacker News',
  ruliweb: '루리웹',
  fmk: '에펨코리아',
} as { [key: string]: string };
