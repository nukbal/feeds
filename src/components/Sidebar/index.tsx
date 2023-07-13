import { sidebar } from 'models/size';
import { px } from 'utils/unit';
import { platform } from 'config/const';

import ResizeBorder from '../ResizeBorder';

import Decorator from './Decorator';
import FeedList from './FeedList';
import focus from 'models/focus';

export default function Sidebar() {
  const [size, setSize] = sidebar;

  const handleSize = (delta: number) => {
    setSize((prev) => {
      const nextVal = prev + delta;
      if (nextVal > 350) return 350;
      if (nextVal < 200) return 200;
      return nextVal;
    });
  };

  return (
    <aside
      class="relative select-none"
      classList={{ 'bg-stone-900': platform() !== 'darwin', 'opacity-50': !focus() }}
      style={{ width: px(size()), 'min-width': px(size()) }}
    >
      <div class="w-full h-12" data-tauri-drag-region>
        <Decorator />
      </div>
      <FeedList />
      <ResizeBorder onSizeChange={handleSize} />
    </aside>
  );
}
