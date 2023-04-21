import { For } from "solid-js";

export default function FeedLoading() {
  let arr = Array.from({ length: 8 });
  return (
    <div class="animate-pulse">
      <For each={arr}>
        {() => (
          <div class="block p-4 rounded">
            <div class="rounded h-4 w-32 bg-stone-600" />
            <div class="rounded h-4 w-full mt-2 bg-stone-600" />
            <div class="flex mt-2">
              <div class="rounded h-4 flex-auto mr-2 bg-stone-600" />
              <div class="rounded h-4 flex-auto bg-stone-600" />
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
