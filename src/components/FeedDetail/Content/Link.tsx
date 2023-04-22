import { open } from '@tauri-apps/api/shell';

interface Props {
  url: string;
  label?: string | null;
  class?: string;
  maxLength?: number;
}

export default function ContentLink({ url, maxLength = 64, ...rest }: Props) {
  const openLink = () => open(url);

  let text = url;
  if (rest.label) {
    text = rest.label;
  }

  return (
    <a class={`text-blue-500 underline cursor-pointer ml-1 first:ml-0 ${rest.class || ''}`} onClick={openLink}>
      {text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}
    </a>
  );
}
