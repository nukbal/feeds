import { Dynamic } from 'solid-js/web';
import { IconTypes } from 'solid-icons';

interface Props {
  class?: string;
  Icon: IconTypes;
  children?: any;
}

export default function Time(p: Props) {
  return (
    <div class={['flex items-center leading-none', p.class].join(' ')}>
      <Dynamic component={p.Icon} class="mb-0.5" />
      <span class="text-sm ml-1">
        {p.children}
      </span>
    </div>
  );
}
