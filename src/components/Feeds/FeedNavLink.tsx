import { detailRoute, feedRoute } from 'models/route';

interface NavProps {
  id: string;
  subId: string | null;
  children: any;
}

export default function FeedLink({ id, subId, children }: NavProps) {
  const [route, setRoute] = detailRoute;

  const isActive = () => route().id === id;
  const handleNavigate = () => {
    const parent = feedRoute[0]();
    setRoute({ ...parent, id, subId });
  };

  return (
    <button
      class={`block p-4 w-full text-left rounded relative ${isActive() ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
      onClick={handleNavigate}
    >
      {children}
    </button>
  );
}
