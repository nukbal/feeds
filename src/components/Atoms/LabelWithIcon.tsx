import { Dynamic } from 'solid-js/web';
import { IconTypes } from 'solid-icons';

interface Props {
  class?: string;
  Icon: IconTypes;
  size?: number;
  children?: any;
}

export default function Time(p: Props) {
  return (
    <div class={['inline-flex items-center', p.class].join(' ')}>
      <i class="pb-0.5 shrink-0">
        <Dynamic component={p.Icon} size={p.size || '1em'} />
      </i>
      <p class="text-sm ml-1 leading-none">
        {p.children}
      </p>
    </div>
  );
}
