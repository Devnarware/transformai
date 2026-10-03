import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
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
    <div className="app-shell">
      <Sidebar health={health} />
      <div className="main-area">
        <Topbar health={health} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new" element={<NewTransformation />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<Detail />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings health={health} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
