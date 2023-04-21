import { useParams } from '@solidjs/router';
import { IoFilterCircleOutline, IoShareOutline } from 'solid-icons/io';

import useTitle from 'models/title';

export default function FeedDetailHeader() {
  // const params = useParams();
  const [title] = useTitle;

  return (
    <div
      class="flex flex-auto items-center h-12 px-3 w-full justify-between border-b border-stone-900 bg-stone-700 drop-shadow-lg select-none"
      data-tauri-drag-region
      style={{ 'border-top-right-radius': '12px' }}
    >
      <h3 class="font-medium text-sm m-0 p-0 leading-none cursor-default focus:cursor-default">{title()}</h3>
      <button class="px-2 py-1.5 hover:bg-gray-400/40 rounded leading-none">
        <IoShareOutline size="20" />
      </button>
    </div>
  );
}
