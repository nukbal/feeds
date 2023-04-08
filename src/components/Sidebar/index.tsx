import { sidebar } from 'models/size';
import { px } from 'utils/unit';

import ResizeBorder from '../ResizeBorder';

import Decorator from './Decorator';
import FeedList from './FeedList';

export default function Sidebar() {
  const [size, setSize] = sidebar;
  return (
    <aside class="relative select-none" style={{ width: px(size()), 'min-width': px(size()) }}>
      <div class="w-full h-12" data-tauri-drag-region>
        <Decorator />
      </div>
      <FeedList />
      <ResizeBorder onSizeChange={setSize} max={350} min={200} />
    </aside>
  );
}
