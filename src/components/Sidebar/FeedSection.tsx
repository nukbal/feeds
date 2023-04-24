import { For, Show, createSignal, Switch, Match } from 'solid-js';
import { IoChevronDown, IoChevronUp, IoAddCircleOutline } from 'solid-icons/io'

import Link from './FeedLink';

interface Props {
  id: SupportServices;
  name: string;
  items: FeedLinkItem[];
}

export default function FeedSection(p: Props) {
  const [show, setShow] = createSignal(true);
  const [hover, setHover] = createSignal(false);

  const toggleList = () => {
    setShow(!show())
  };

  return (
    <div class="cursor-default text-sm mb-6">
      <div
        class="flex items-center justify-between"
        onMouseOver={() => setHover(true)}
        onPointerOver={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onMouseLeave={() => setHover(false)}
      >
        <h3 class="block opacity-60 font-medium tracking-tight leading-6">{p.name}</h3>
        <div class="flex items-center space-x-1.5">
          <Show when={hover()}>
            <button type="button" class="opacity-60 hover:opacity-90">
              <IoAddCircleOutline />
            </button>
            <button type="button" class="opacity-60 hover:opacity-90" onClick={toggleList}>
              <Switch>
                <Match when={show()}><IoChevronUp /></Match>
                <Match when={!show()}><IoChevronDown /></Match>
              </Switch>
            </button>
          </Show>
        </div>
      </div>
      <Show when={show()}>
        <div class="flex flex-col">
          <For each={p.items}>
            {(item) => <Link name={p.id} feed={item.id} label={item.label} removable={item.removable} />}
          </For>
        </div>
      </Show>
    </div>
  );
}
