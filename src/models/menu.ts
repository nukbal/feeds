import { createSignal } from 'solid-js';

const defaultValue = [
  { id: 'hacker_news', name: 'HackerNews', items: [{ id: 'front', label: 'FrontPage' }] },
  {
    id: 'ruliweb',
    name: '루리웹',
    items: [
      { id: 'best', label: '힛갤' },
      { id: 'all_best', label: '베스트 전체' },
      { id: 'humor', label: '유머 베스트' },
      { id: 'news:1001', label: '콘솔 정보 게시판' },
      { id: 'news:1004', label: '모바일 정보 게시판' },
      { id: 'news:1003', label: 'PC 정보 게시판' },
      { id: 'hit_history', label: '오른쪽' },
    ],
  },
  {
    id: 'fmk',
    name: '에펨코리아',
    items: [
      { id: 'best', label: '포텐 터짐' },
      { id: 'best2', label: '포텐 터짐 (화제순)' },
      { id: 'food', label: '음식/여행', removable: true },
    ],
  },
] as Array<{ id: SupportServices; name: string; items: FeedLinkItem[] }>;

const [menu, setMenu] = createSignal(defaultValue, { equals: false });

export default menu;
