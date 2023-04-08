import Time from 'components/Atoms/Time';
import { For } from 'solid-js';

interface Props {
  data: FeedCommentType;
}

export default function CommentItem(p: Props) {
  return (
    <li class="p-2 text-sm">
      <div class="flex pb-2 items-center justify-between">
        <h5>{p.data.author}</h5>
        <Time date={p.data.createdAt} />
      </div>
      <div>
        <For each={p.data.contents}>
          {(item) => <p>{item.text}</p>}
        </For>
      </div>
    </li>
  );
}
