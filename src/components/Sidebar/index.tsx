import { sidebar } from 'models/size';
import { px } from 'utils/unit';

import ResizeBorder from '../ResizeBorder';

import Decorator from './Decorator';
import FeedList from './FeedList';

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
    <aside class="relative select-none" style={{ width: px(size()), 'min-width': px(size()) }}>
      <div class="w-full h-12" data-tauri-drag-region>
        <Decorator />
      </div>
      <FeedList />
      <ResizeBorder onSizeChange={handleSize} />
    </aside>
  );
}
