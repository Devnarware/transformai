import { Wand2, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  if (pathname === '/dashboard') return 'Overview & Analytics';
  if (pathname === '/new') return 'New Transformation';
  if (pathname.startsWith('/history/')) return 'Transformation Details';
  if (pathname === '/history') return 'Transformation History';
  if (pathname === '/templates') return 'Deliverable Templates';
  if (pathname === '/settings') return 'Engine & Parameter Settings';
  return 'Overview';
};

export default function Topbar({ health }) {
  const location = useLocation();
  const isOnline = health?.status === 'ok';
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="topbar">
      <div className="topbar-title-area">
        <span className="topbar-crumb">{pageTitle}</span>
      </div>

      <div className="topbar-actions">
        <div
          className="system-pill"
          title={
            isOnline
              ? `Transformation engine running (${health?.demoMode ? 'Local Rule Engine' : health?.aiProvider || 'AI Mode'})`
              : 'Connecting to backend...'
          }
        >
          <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
          <span>{isOnline ? 'Engine Ready' : 'Connecting...'}</span>
        </div>

        {location.pathname !== '/new' && (
          <Link to="/new" className="topbar-cta-button">
            <Plus size={16} strokeWidth={2.2} />
            <span>New Transformation</span>
          </Link>
        )}
      </div>
    </header>
  );
}
