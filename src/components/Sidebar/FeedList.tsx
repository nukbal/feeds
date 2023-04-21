import { NavLink } from '@solidjs/router';

import focus from 'models/focus';

function Link({ to, label }: { to: string; label: string; }) {
  const handleClickLink = () => {

  };

  return (
    <NavLink href={to} class="p-1 rounded" activeClass="bg-gray-500/50" onClick={handleClickLink}>
      {label}
    </NavLink>
  );
}

export default function FeedList() {
  return (
    <div class={`px-3 pb-8 text-gray-300 select-none ${focus() ? '' : 'opacity-40'}`}>
      <div class="cursor-default text-sm mb-6">
        <h3 class="font-medium opacity-60 tracking-tight">Feeds</h3>
        <div class="flex flex-col">
          <Link to="/feeds/hacker_news" label="HackerNews" />
        </div>
      </div>
      <div class="cursor-default text-sm">
        <h3 class="font-medium opacity-60 tracking-tight">Ruliweb</h3>
        <div class="flex flex-col">
          <Link to="/feeds/ruliweb" label="힛갤" />
          <Link to="/feeds/ruli_best" label="베스트" />
          <Link to="/feeds/ruli_humor" label="유머BEST" />
          <Link to="/feeds/ruli_news_console" label="콘솔 정보 게시판" />
          <Link to="/feeds/ruli_news_mobile" label="모바일 정보 게시판" />
          <Link to="/feeds/ruli_news_pc" label="PC 정보 게시판" />
        </div>
      </div>
    </div>
  );
}
