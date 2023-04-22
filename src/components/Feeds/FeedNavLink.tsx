import { Link, useParams } from '@solidjs/router';

interface NavProps {
  id: string;
  subId: string | null;
  children: any;
}

export default function FeedLink({ id, subId, children }: NavProps) {
  const params = useParams();
  const isActive = () => params.id === id;
  return (
    <Link
      href={`read/${id}?subId=${subId}`}
      class={`block p-4 rounded relative ${isActive() ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
    >
      {children}
    </Link>
  );
}
