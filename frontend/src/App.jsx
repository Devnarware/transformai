import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import NewTransformation from './pages/NewTransformation';
import History from './pages/History';
import Detail from './pages/Detail';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
const L = [['/dashboard', 'Dashboard'], ['/new', 'New Transformation'], ['/history', 'History'], ['/templates', 'Templates'], ['/settings', 'Settings']];
export default function App() {
  const [h, setH] = useState(null);
  useEffect(() => { api.get('/health').then(setH).catch(() => setH({ status: 'down' })); }, []);
  return (<div className="app"><aside><h1>TransformAI</h1><small>One Source. Multiple Deliverables.</small>
    <nav>{L.map(([to, t]) => <NavLink key={to} to={to}>{t}</NavLink>)}</nav>
    <div className="status"><b>System Status</b><br />{h?.status === 'ok' ? 'Backend online' : 'Backend offline'}<br />{h?.demoMode ? 'Demo Mode — Local Transformation Engine' : h?.aiProvider}</div></aside>
    <main><Routes><Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} /><Route path="/new" element={<NewTransformation />} />
      <Route path="/history" element={<History />} /><Route path="/history/:id" element={<Detail />} />
      <Route path="/templates" element={<Templates />} /><Route path="/settings" element={<Settings health={h} />} /></Routes></main></div>);
}
