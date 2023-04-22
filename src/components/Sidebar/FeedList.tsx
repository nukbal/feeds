import focus from 'models/focus';

import Link from './FeedLink';

export default function FeedList() {
  return (
    <div class={`px-3 pb-8 text-gray-300 select-none ${focus() ? '' : 'opacity-40'}`}>
      <div class="cursor-default text-sm mb-6">
        <h3 class="font-medium opacity-60 tracking-tight">HackerNews</h3>
        <div class="flex flex-col">
          <Link name="hacker_news" feed="front" label="FrontPage" />
        </div>
      </div>
      <div class="cursor-default text-sm mb-6">
        <h3 class="font-medium opacity-60 tracking-tight">루리웹</h3>
        <div class="flex flex-col">
          <Link name="ruliweb" feed="best" label="힛갤" />
          <Link name="ruliweb" feed="all_best" label="베스트 전체" />
          <Link name="ruliweb" feed="humor" label="유머 베스트" />
          <Link name="ruliweb" feed="news:1001" label="콘솔 정보 게시판" />
          <Link name="ruliweb" feed="news:1004" label="모바일 정보 게시판" />
          <Link name="ruliweb" feed="news:1003" label="PC 정보 게시판" />
          <Link name="ruliweb" feed="hit_history" label="오른쪽" />
        </div>
      </div>
      <div class="cursor-default text-sm mb-6">
        <h3 class="font-medium opacity-60 tracking-tight">에펨코리아</h3>
        <div class="flex flex-col">
          <Link name="fmk" feed="best" label="포텐 터짐" />
        </div>
      </div>
    </div>
  );
}
