import { IoTimeOutline } from 'solid-icons/io';

import parseRelativeDate from 'utils/parseRelativeDate';

import LabelWithIcon from './LabelWithIcon';

interface Props {
  class?: string;
  date?: string;
}

export default function Time(p: Props) {
  return (
    <LabelWithIcon Icon={IoTimeOutline} class={p.class}>
      {parseRelativeDate(p.date)}
    </LabelWithIcon>
  );
}
