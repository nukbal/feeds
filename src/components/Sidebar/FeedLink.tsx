import { createSignal, Show } from 'solid-js';
import { IoCloseCircleOutline } from 'solid-icons/io';

import { feedRoute } from 'models/route';

interface Props {
  name: string;
  feed: string;
  label: string;
  removable?: boolean;
}

export default function FeedLink({ name, feed, label, removable }: Props) {
  const [hover, setHover] = createSignal(false);
  const [route, setRoute] = feedRoute;

  const handleClickLink = () => {
    setRoute({ name, feed });
    localStorage.setItem('init_route', JSON.stringify({ name, feed }));
  };

  const isActive = () => route().name === name && route().feed === feed;

  const handleRemove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  return (
    <button
      class={`p-1 rounded flex items-center justify-between ${isActive() ? 'bg-gray-500/50' : ''}`}
      onClick={handleClickLink}
      onMouseOver={() => setHover(true)}
      onPointerOver={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onMouseLeave={() => setHover(false)}
    >
      <span>{label}</span>
      <Show when={removable && hover()}>
        <button type="button" class="opacity-60 hover:opacity-90" onClick={handleRemove}>
          <IoCloseCircleOutline />
        </button>
      </Show>
    </button>
  );
}