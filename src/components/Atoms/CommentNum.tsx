import { IoChatbubblesOutline } from 'solid-icons/io';

import LabelWithIcon from './LabelWithIcon';

interface Props {
  ref?: any;
  class?: string;
  count?: number;
}

export default function Time(p: Props) {
  return (
    <LabelWithIcon ref={p.ref} Icon={IoChatbubblesOutline} class={p.class}>
      {p.count}
    </LabelWithIcon>
  );
}
