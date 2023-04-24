import { createSignal, Show } from 'solid-js';
import { Link, useLocation } from '@solidjs/router';
import { IoCloseCircleOutline } from 'solid-icons/io'

interface Props {
  name: string;
  feed: string;
  label: string;
  removable?: boolean;
}

export default function FeedLink({ name, feed, label, removable }: Props) {
  const location = useLocation();
  const [hover, setHover] = createSignal(false);

  const path = `/feeds/${name}/${feed}/`;
  const handleClickLink = () => localStorage.setItem('init_path', path);

  const isActive = () => location.pathname.startsWith(path);

  const handleRemove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  return (
    <Link
      href={path}
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
    </Link>
  );
}