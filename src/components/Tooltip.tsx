import { onCleanup, onMount, type JSX } from 'solid-js';
import { computePosition, ComputePositionConfig, flip, shift, offset, Placement } from '@floating-ui/dom';
import { Ref } from '@solid-primitives/refs';

import { px } from 'utils/unit';

interface Props {
  label: JSX.Element;
  children: JSX.Element;
  placement?: Placement;
}

export default function Tooltip(p: Props) {
  let anchorRef: HTMLDivElement | undefined;
  let popRef: HTMLDivElement | undefined;

  const updateTooltip = () => {
    if (!anchorRef || !popRef) return;

    const config = {
      middleware: [flip(), shift({ padding: 6 }), offset(6)],
      placement: p.placement || 'top',
    } as Partial<ComputePositionConfig>;

    computePosition(anchorRef!, popRef!, config).then(({ x, y }) => {
      Object.assign(popRef!.style, {
        left: px(x),
        top: px(y),
      });
    });
  };

  const onHover = () => {
    if (!popRef) return;
    popRef.style.display = 'block';
    updateTooltip();
  };

  const onBlur = () => {
    if (!popRef) return;
    popRef.style.display = '';
  };

  onMount(() => {
    anchorRef?.addEventListener('mouseenter', onHover);
    anchorRef?.addEventListener('focus', onHover);

    anchorRef?.addEventListener('mouseleave', onBlur);
    anchorRef?.addEventListener('blur', onBlur);
  });

  onCleanup(() => {
    anchorRef?.removeEventListener('mouseenter', onHover);
    anchorRef?.removeEventListener('focus', onHover);

    anchorRef?.removeEventListener('mouseleave', onBlur);
    anchorRef?.removeEventListener('blur', onBlur);
  });

  return (
    <>
      <Ref ref={anchorRef}>{p.children}</Ref>
      <div
        class="absolute w-max rounded py-2 px-3 bg-stone-700 border-1 border-stone-800/50 top-0 left-0 shadow-xl hidden"
        ref={popRef}
      >
        {p.label}
      </div>
    </>
  );
}
