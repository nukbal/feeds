import { createSignal, Switch, Match } from 'solid-js';
import { IoVideocamOffOutline } from 'solid-icons/io'

interface Props {
  data: ContentVideo;
  comment?: boolean;
}

export default function Video({ data, comment }: Props) {
  const [loading, setLoading] = createSignal<boolean | null>(true);

  const getImageClass = () => {
    const loadingClass = loading() ? 'bg-gray-400/20 rounded animate-pulse' : '';
    if (comment) return loadingClass;
    return `m-0 mx-auto ${loadingClass}`;
  };

  return (
    <Switch>
      <Match when={loading() !== null}>
        <video
          class={getImageClass()}
          src={data.url}
          style={{
            'max-width': '90%',
            'min-width': loading() ? '32rem' : undefined,
            'min-height': loading() ? '18rem' : undefined,
          }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(null)}
          controls={!comment && !data.url.endsWith('gif')}
          autoplay={comment || data.url.endsWith('gif')}
          muted={comment || data.url.endsWith('gif')}
          loop={comment || data.url.endsWith('gif')}
          preload="none"
        />
      </Match>
      <Match when={loading() === null}>
        <div class={`h-64 w-96 flex flex-col items-center justify-center rounded bg-gray-400/20 text-red-400 ${comment ? '' : 'mx-auto'}`}>
          <IoVideocamOffOutline size="48" />
          <p class="p-2">Video load failed!</p>
          <p class="px-4" style={{ 'line-break': 'anywhere' }}>{data.url}</p>
        </div>
      </Match>
    </Switch>
  );
}
