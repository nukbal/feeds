import { onMount } from 'solid-js';

import title from 'models/title';

export default function FeedDetailEmpty() {
  const [_, setTitle] = title;

  onMount(() => {
    setTitle('');
  });

  return (
    <div class="absolute inset-x-0 inset-y-0 top-14 pb-16 flex items-center justify-center">
      <h2 class="text-2xl opacity-50">Not Found</h2>
    </div>
  );
}
