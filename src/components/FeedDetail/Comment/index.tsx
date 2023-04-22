import { For, Show } from 'solid-js';
import { IoChatbubbleEllipsesOutline, IoCaretUpOutline, IoCaretDownOutline } from 'solid-icons/io'
import { FaSolidFire } from 'solid-icons/fa';

import Time from 'components/Atoms/Time';
import LabelWithIcon from 'components/Atoms/LabelWithIcon';

import Content from '../Content';

interface Props {
  data: FeedCommentType;
}

export default function CommentItem({ data }: Props) {
  const num = data.up! - (data.down || 0);
  let Icon = num > 0 ? IoCaretUpOutline : IoCaretDownOutline;
  if (data.isBest) {
    Icon = FaSolidFire;
  }

  if (data.removed) {
    return (
      <li class="p-2 text-sm select-none" style={{ 'padding-left': `${data.depth * 0.625 + 0.5}rem` }}>
        <div class="rounded p-2 select-auto bg-stone-600/20">
          <p class="opacity-50">삭제된 댓글입니다.</p>
        </div>
      </li>
    );
  }

  return (
    <li class="p-2 text-sm select-none" style={{ 'padding-left': `${data.depth * 0.625 + 0.5}rem` }}>
      <div class="flex pb-2 items-center justify-between select-none">
        <div class="flex items-center">
          <Show when={num}>
            <LabelWithIcon
              Icon={Icon}
              class={`mr-2 text-${num > 0 ? 'red' : 'violet'}-500`}
              size={12}
            >
              <span title={`${data.up ?? '-'} (${data.down ?? '-'})`}>{num}</span>
            </LabelWithIcon>
          </Show>
          <Show when={data.isBest && !num}>
            <span class="ml-2 text-red-500"><FaSolidFire /></span>
          </Show>
          <h5 class="font-medium">{data.author}</h5>
          <Show when={data.replyTo}>
            <LabelWithIcon Icon={IoChatbubbleEllipsesOutline} class="opacity-50 ml-2" size={10}>
              <span class="text-xs">{data.replyTo}</span>
            </LabelWithIcon>
          </Show>
        </div>
        <Time date={data.createdAt} />
      </div>
      <div class="rounded p-2 select-auto bg-stone-600/20">
        <For each={data.contents}>
          {(item) => <Content data={item} comment />}
        </For>
      </div>
    </li>
  );
}
