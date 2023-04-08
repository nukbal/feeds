import { Router } from '@solidjs/router';

import PageRouter from './pages';

export default function App() {
  return (
    <Router>
      <PageRouter />
    </Router>
  );
}
