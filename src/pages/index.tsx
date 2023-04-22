import { Navigate, Route, Routes } from '@solidjs/router';

import EmptyDetail from 'components/FeedDetail/Empty';
import Sidebar from 'components/Sidebar';

import FeedPage from './FeedPage';
import DetailPages from './DetailPage';

export default function AppRouter() {
  const initialPath = localStorage.getItem('init_path') || '/feeds/hacker_news/front';
  return (
    <div class="flex flex-auto basis-full text-gray-300">
      <Sidebar />
      <div
        class="flex flex-row flex-auto"
        style={{ 'border-bottom-right-radius': '12px' }}
      >
        <Routes>
          <Route path="/feeds/:name/:feed" component={FeedPage}>
            <Route path="/" component={EmptyDetail} />
            <Route path="/read/:id" component={DetailPages} />
          </Route>
          <Route path="*" element={<Navigate href={initialPath} />} />
        </Routes>
      </div>
    </div>
  );
}
