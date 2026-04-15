import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes.js';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider.jsx';
import { authAPI } from '../services/api';

function App() {
  // Pre-warm the backend on initial load (addresses Render cold start)
  useEffect(() => {
    console.log('[ProBuild] Pre-warming backend service...');
    authAPI.healthCheck();
  }, []);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;