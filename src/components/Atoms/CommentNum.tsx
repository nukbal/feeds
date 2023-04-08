import { IoChatbubblesOutline } from 'solid-icons/io';

import LabelWithIcon from './LabelWithIcon';

interface Props {
  class?: string;
  count?: number;
}

export default function Time(p: Props) {
  return (
    <LabelWithIcon Icon={IoChatbubblesOutline} class={p.class}>
      {p.count}
    </LabelWithIcon>
  );
}
