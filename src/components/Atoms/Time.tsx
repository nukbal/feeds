import { Switch, Match } from 'solid-js';
import { IoTimeOutline } from 'solid-icons/io';

import parseRelativeDate from 'utils/parseRelativeDate';

import LabelWithIcon from './LabelWithIcon';
import Tooltip from '../Tooltip';

interface Props {
  ref?: any;
  class?: string;
  date?: string;
  full?: boolean;
}

export default function Time(p: Props) {
  return (
    <Switch>
      <Match when={p.full}>
        <LabelWithIcon ref={p.ref} Icon={IoTimeOutline} class={p.class}>
          {parseRelativeDate(p.date, p.full)}
        </LabelWithIcon>
      </Match>
      <Match when={!p.full}>
        <Tooltip label={parseRelativeDate(p.date, true)} placement="top-end">
          <LabelWithIcon ref={p.ref} Icon={IoTimeOutline} class={p.class}>
            {parseRelativeDate(p.date)}
          </LabelWithIcon>
        </Tooltip>
      </Match>
    </Switch>
  );
}
