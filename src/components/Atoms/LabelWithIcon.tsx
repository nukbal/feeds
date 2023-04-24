import { Dynamic } from 'solid-js/web';
import { IconTypes } from 'solid-icons';

interface Props {
  ref?: any;
  class?: string;
  Icon: IconTypes;
  size?: number;
  children?: any;
}

export default function LabelWithIcon(p: Props) {
  return (
    <div ref={p.ref} class={['inline-flex items-center', p.class].join(' ')}>
      <i class="pb-0.5 shrink-0">
        <Dynamic component={p.Icon} size={p.size || '1em'} />
      </i>
      <p class="text-sm ml-1 leading-none">
        {p.children}
      </p>
    </div>
  );
}
