import { createSignal } from 'solid-js';

const init = localStorage.getItem('init_route');

export interface FeedRouteType {
  name: string;
  feed: string;
}

export const feedRoute = createSignal<FeedRouteType>(init ? JSON.parse(init) : { name: 'hacker_news', feed: 'front' });

export interface FeedDetailRouteType extends FeedRouteType {
  id: string;
  subId?: string | null;
}

export const detailRoute = createSignal<FeedDetailRouteType>({ name: '', feed: '', id: '' }, { equals: false });

