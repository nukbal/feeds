import { onCleanup, onMount, type JSX, Show, createSignal } from 'solid-js';
import { computePosition, ComputePositionConfig, flip, shift, offset, Placement } from '@floating-ui/dom';
import { Ref } from '@solid-primitives/refs';

import { px } from 'utils/unit';

export type PopoverRefType = { open: () => void, close: () => void; };

interface Props {
  ref?: (ref: PopoverRefType) => void;
  label: JSX.Element;
  children: JSX.Element;
  placement?: Placement;
}

export default function Popover(p: Props) {
  const [show, setShow] = createSignal(false);

  let anchorRef: HTMLDivElement | undefined;
  let popRef: HTMLDivElement | undefined;

  onMount(() => {
    p.ref?.({ open: () => setShow(true), close: () => setShow(false) });
  });

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
    updateTooltip();
    setShow(true);
  };

  const onBlur = () => {
    setShow(false);
  };

  onMount(() => {
    anchorRef?.addEventListener('click', onHover);
  });

  onCleanup(() => {
    anchorRef?.removeEventListener('click', onHover);
  });

  return (
    <>
      <Ref ref={anchorRef}>{p.label}</Ref>
      <Show when={show()}><div class="fixed inset-0" onClick={onBlur} /></Show>
      <div
        class="absolute w-max rounded bg-stone-700 border-1 border-stone-800 top-0 left-0 shadow-xl hidden"
        ref={popRef}
        style={{ display: show() ? 'block' : '' }}
      >
        {p.children}
      </div>
    </>
  );
}
