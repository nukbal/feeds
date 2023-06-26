import { Router, memoryIntegration } from '@solidjs/router';

import PageRouter from './pages';

export default function App() {
  return (
    <Router source={memoryIntegration()}>
      <PageRouter />
    </Router>
  );
}
