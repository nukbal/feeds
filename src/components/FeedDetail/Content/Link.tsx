import { IoOpenOutline } from 'solid-icons/io'

interface Props {
  url: string;
}

export default function ContentLink({ url }: Props) {
  return (
    <a href={url} class="text-blue-500 underline">
      {url}
    </a>
  );
}
