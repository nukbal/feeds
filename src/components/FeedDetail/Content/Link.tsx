import { open } from '@tauri-apps/api/shell';
import { useNavigate } from '@solidjs/router';

interface Props {
  url: string;
  label?: string | null;
  class?: string;
  maxLength?: number;
}

export default function ContentLink({ url, maxLength = 64, ...rest }: Props) {
  const navigate = useNavigate();

  const openLink = () => {
    if (!url.startsWith('http')) return;

    if (url.startsWith('https://m.fmkorea.com') || url.startsWith('https://www.fmkorea.com')) {
      const lastIdx = url.includes('?') ? url.indexOf('?') - 1 : url.length - 1;
      const lastCode = url[lastIdx].charCodeAt(0);
      if (lastCode >= 48 && lastCode <= 57) {
        const id = url.substring(url.lastIndexOf('/') + 1, url.length);
        return navigate(`../${id}?name=fmk`);
      }
      if (url.includes('document_srl=')) {
        const id_idx = url.indexOf('document_srl') + 13;
        const id = url.substring(id_idx, url.indexOf('&', 13) || url.length - 1)
        return navigate(`../${id}?name=fmk`);
      }
    } else if ((url.startsWith('https://m.ruliweb.com') || url.startsWith('https://bbs.ruliweb.com')) && url.includes('/read/')) {
      const lastIdx = url.includes('?') ? url.indexOf('?') - 1   : url.length - 1;
      const lastCode = url[lastIdx].charCodeAt(0);
      if (lastCode >= 48 && lastCode <= 57) {
        const id = url.substring(url.lastIndexOf('/') + 1, url.length);
        const boardId = url.substring(url.indexOf('/board/') + 7, url.indexOf('/read/'));
        const boardName = url.substring(url.indexOf('/', 10) + 1, url.indexOf('/board'));
        return navigate(`../${id}?name=ruliweb&feed=${boardName}:${boardId}`)
      }
    }
    open(url);
  }

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
