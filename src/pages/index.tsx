import Sidebar from 'components/Sidebar';

import FeedPage from './FeedPage';
import DetailPages from './DetailPage';

export default function AppRouter() {
  return (
    <div class="flex flex-auto basis-full text-gray-300">
      <Sidebar />
      <div
        class="flex flex-row flex-auto"
        style={{ 'border-bottom-right-radius': '12px' }}
      >
        <FeedPage />
        <DetailPages />
      </div>
    </div>
  );
}
