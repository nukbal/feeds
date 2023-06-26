import { useParams, useSearchParams } from '@solidjs/router';
import { IoGlobeOutline, IoShareOutline, IoCopyOutline } from 'solid-icons/io';
import { open } from '@tauri-apps/api/shell';

import useTitle from 'models/title';
import Popover, { PopoverRefType } from 'components/Popover';

export default function FeedDetailHeader() {
  const params = useParams();
  const [search] = useSearchParams();
  const [title] = useTitle;

  let popover: PopoverRefType | undefined;

  const getUrl = () => {
    const serviceName = search.name || params.name;
    const feedName = search.feed || params.feed;
    const docId = params.id;

    if (serviceName === 'ruliweb') {
      let boardName = 'best';
      let boardId = search.subId || '300143';
      if (feedName.includes(':')) {
        const arr = feedName.split(':');
        boardName = arr[0];
        boardId = arr[1];
      } else if (feedName === 'hit_history') {
        boardName = 'hobby';
      }
      return `https://bbs.ruliweb.com/${boardName}/board/${boardId}/read/${docId}`;
    } else if (serviceName === 'fmk') {
      return `https://www.fmkorea.com/${docId}`;
    } else if (serviceName === 'hacker_news') {

    }
  };

  const openBrowser = () => {
    const url = getUrl();
    if (url) {
      open(url);
    }
    popover?.close();
  };

  const copyUrl = async () => {
    const url = getUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
    }
    popover?.close();
  };

  return (
    <div
      class="flex flex-auto items-center h-12 px-3 w-full justify-between border-b border-stone-900 bg-stone-700 drop-shadow-lg select-none"
      data-tauri-drag-region
      style={{ 'border-top-right-radius': '12px' }}
    >
      <h3 class="font-medium text-sm m-0 p-0 leading-none cursor-default focus:cursor-default">{title()}</h3>
      <Popover
        ref={(e) => { popover = e; }}
        label={(
          <button class="px-2 py-1.5 hover:bg-gray-400/40 rounded leading-none">
            <IoShareOutline size="20" />
          </button>
        )}
      >
        <div class="w-48">
          <button type="button" class="flex items-center w-full py-2 px-2 rounded hover:bg-stone-400/20" onClick={openBrowser}>
            <IoGlobeOutline />
            <span class="ml-2">Open in browser</span>
          </button>
          <button type="button" class="flex items-center w-full py-2 px-2 rounded hover:bg-stone-400/20" onClick={copyUrl}>
            <IoCopyOutline />
            <span class="ml-2">Copy Url</span>
          </button>
        </div>
      </Popover>
    </div>
  );
}
