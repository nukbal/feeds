import { createSignal, Switch, Match } from 'solid-js';
import { IoImageSharp } from 'solid-icons/io'

interface Props {
  data: ContentImage;
  comment?: boolean;
}

export default function Image({ data, comment }: Props) {
  const [loading, setLoading] = createSignal<boolean | null>(true);

  const getImageClass = () => {
    const loadingClass = loading() ? 'bg-gray-400/20 rounded animate-pulse' : '';
    if (comment) return loadingClass;
    return `m-0 mx-auto ${loadingClass}`;
  };

  return (
    <Switch>
      <Match when={loading() !== null}>
        <img
          class={getImageClass()}
          src={data.url}
          alt={data.alt || undefined}
          style={{
            'max-width': '90%',
            'min-width': loading() ? '32rem' : undefined,
            'min-height': loading() ? '18rem' : undefined,
          }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(null)}
          loading="lazy"
        />
      </Match>
      <Match when={loading() === null}>
        <div class={`h-64 w-96 flex flex-col items-center justify-center rounded bg-gray-400/20 text-red-400 ${comment ? '' : 'mx-auto'}`}>
          <IoImageSharp size="48" />
          <p class="p-4">Image load failed!</p>
          <p class="px-4" style={{ 'line-break': 'anywhere' }}>{data.url}</p>
        </div>
      </Match>
    </Switch>
  );
}
