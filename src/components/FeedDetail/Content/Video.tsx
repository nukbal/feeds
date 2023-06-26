import { createSignal, Switch, Match, Show } from 'solid-js';
import { IoVideocamOffOutline } from 'solid-icons/io'

interface Props {
  data: ContentVideo;
  comment?: boolean;
}

export default function Video({ data, comment }: Props) {
  const [loading, setLoading] = createSignal<boolean | null>(true);
  const [error, setError] = createSignal('');

  const getImageClass = () => {
    const loadingClass = loading() ? 'bg-gray-400/20 rounded animate-pulse' : '';
    if (comment) return loadingClass;
    return `m-0 mx-auto ${loadingClass}`;
  };

  const isAutoPlayable = comment || data.url.endsWith('gif');

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
          poster={data.thumb || undefined}
          onLoad={() => setLoading(false)}
          onLoadStart={() => setLoading(false)}
          onError={(e) => {
            setLoading(null);
            const elem = e.target as HTMLVideoElement;
            setError(`${elem.error?.code} (${elem.error?.message})`);
          }}
          controls={!isAutoPlayable}
          autoplay={isAutoPlayable}
          muted={isAutoPlayable}
          loop={isAutoPlayable}
          preload="none"
        />
      </Match>
      <Match when={loading() === null}>
        <div class={`h-64 w-96 flex flex-col items-center justify-center rounded bg-gray-400/20 text-red-400 ${comment ? '' : 'mx-auto'}`}>
          <IoVideocamOffOutline size="48" />
          <p class="p-2">Video load failed!</p>
          <p class="px-4" style={{ 'line-break': 'anywhere' }}>{data.url}</p>
          <Show when={error()}>
            <p>{error()}</p>
          </Show>
        </div>
      </Match>
    </Switch>
  );
}
