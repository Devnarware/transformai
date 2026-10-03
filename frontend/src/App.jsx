import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import WorkspaceLayout from './components/layout/WorkspaceLayout';
import NewTransformation from './pages/NewTransformation';
import History from './pages/History';
import Detail from './pages/Detail';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchHealth = () => {
      api
        .get('/health')
        .then((data) => {
          if (mounted) setHealth(data);
        })
        .catch(() => {
          if (mounted) setHealth({ status: 'down' });
        });
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Routes>
      {/* Home / Overview: MiniFolio clean standalone landing without sidebar */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Workspace routes with clean minimal topbar */}
      <Route element={<WorkspaceLayout health={health} />}>
        <Route path="/new" element={<NewTransformation />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<Detail />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings health={health} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
