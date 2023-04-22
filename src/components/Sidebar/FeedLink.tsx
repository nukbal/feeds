import { Link, useLocation } from '@solidjs/router';

interface Props {
  name: string;
  feed: string;
  label: string;
}

export default function FeedLink({ name, feed, label }: Props) {
  const location = useLocation();

  const path = `/feeds/${name}/${feed}/`;
  const handleClickLink = () => localStorage.setItem('init_path', path);

  const isActive = () => location.pathname.startsWith(path);

  return (
    <Link
      href={path}
      class={`p-1 rounded ${isActive() ? 'bg-gray-500/50' : ''}`}
      onClick={handleClickLink}
    >
      {label}
    </Link>
  );
}