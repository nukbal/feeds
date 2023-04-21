import { Switch, Match, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import Link from './Link';

interface Props {
  class?: string;
  data: ContentType;
  nested?: boolean;
  comment?: boolean;
}

export default function Content({ data, nested, comment }: Props) {
  return (
    <Switch>
      <Match when={data.type === 'text'}>
        <Dynamic component={(data as ContentText).name ?? 'span'} class={nested ? '' : 'block pb-1'}>
          {(data as ContentText).text}
        </Dynamic>
      </Match>
      <Match when={data.type === 'block'}>
        <Dynamic component={(data as ContentBlock).name ?? 'div'}>
          <For each={(data as ContentBlock).items}>
            {(item) => <Content data={item} nested comment={comment} />}
          </For>
        </Dynamic>
      </Match>
      <Match when={data.type === 'link'}>
        <Link url={(data as ContentLink).url} />
      </Match>
      <Match when={data.type === 'image'}>
        <figure class="w-full py-2">
          <img
            class={comment ? '' : "m-0 mx-auto"}
            src={(data as ContentImage).url}
            alt={(data as ContentImage).alt || undefined}
            style={{ 'max-width': '90%' }}
          />
        </figure>
      </Match>
      <Match when={data.type === 'video'}>
        <figure class="w-full py-2">
          <video
            class={comment ? '' : "m-0 mx-auto"}
            src={(data as ContentLink).url}
            style={{ 'max-width': '90%' }}
            controls={!comment}
            autoplay={comment}
            muted={comment}
            loop={comment}
          />
        </figure>
      </Match>
      <Match when={data.type === 'youtube'}>
        <figure class="w-full py-2">
          <iframe
            class={comment ? '' : "m-0 mx-auto"}
            width="560"
            height="315"
            src={(data as ContentLink).url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          />
        </figure>
      </Match>
      <Match when={data.type !== 'text'}>
        <p>{JSON.stringify(data)}</p>
      </Match>
    </Switch>
  );
}
