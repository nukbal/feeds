import { Switch, Match, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import Link from './Link';
import Image from './Image';
import Video from './Video';

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
        <Dynamic
          component={(data as ContentText).name ?? 'span'}
          classList={{
            'block mb-1 last:mb-0': !nested,
            'overflow-x-auto no-scrollbar bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10 p-2 rounded': (data as ContentText).name === 'pre',
          }}
        >
          {(data as ContentText).text}
        </Dynamic>
      </Match>
      <Match when={data.type === 'block'}>
        <Dynamic class="whitespace-pre-wrap break-words pb-1.5 last:pb-0" component={(data as ContentBlock).name ?? 'div'}>
          <For each={(data as ContentBlock).items}>
            {(item) => <Content data={item} nested comment={comment} />}
          </For>
        </Dynamic>
      </Match>
      <Match when={data.type === 'link'}>
        <Link url={(data as ContentLink).url} label={(data as ContentLink).text} />
      </Match>
      <Match when={data.type === 'image'}>
        <figure class="w-full py-2 select-none">
          <Image data={data as ContentImage} comment={comment} />
        </figure>
      </Match>
      <Match when={data.type === 'video'}>
        <figure class="w-full py-2 select-none">
          <Video data={data as ContentVideo} comment={comment} />
        </figure>
      </Match>
      <Match when={data.type === 'youtube'}>
        <figure class="w-full py-2 select-none">
          <iframe
            class={comment ? '' : "m-0 mx-auto"}
            width="560"
            height="315"
            src={(data as ContentEmbed).url}
            loading="lazy"
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
