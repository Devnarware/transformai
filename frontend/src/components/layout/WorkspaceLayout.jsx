import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sparkles, ArrowLeft, Wand2, Layers, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';

export default function WorkspaceLayout({ health }) {
  const location = useLocation();
  const isOnline = health?.status === 'ok';

  const navItems = [
    { to: '/new', label: 'Transform', icon: Wand2 },
    { to: '/templates', label: 'Templates', icon: Layers },
    { to: '/history', label: 'History', icon: HistoryIcon },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="workspace-shell">
      <header className="workspace-navbar">
        <div className="workspace-navbar-content">
          <Link to="/" className="workspace-brand" title="TransformAI Home">
            <div className="nav-brand-icon">
              <Sparkles size={16} />
            </div>
            <div className="brand-text">
              <strong>TransformAI</strong>
              <span>Multi-Deliverable Engine</span>
            </div>
          </Link>

          <nav className="workspace-nav-center">
            <Link to="/" className="workspace-back-pill" title="Return to Landing Page">
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </Link>
            <div className="workspace-nav-links">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to || (to === '/new' && location.pathname.startsWith('/new'));
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`workspace-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="workspace-nav-status">
            <div className="system-pill" title="Engine Status">
              <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
              <span>{isOnline ? 'Engine Ready' : 'Connecting...'}</span>
            </div>
            {location.pathname !== '/new' && (
              <Link to="/new" className="nav-pill-button">
                <span>+ New</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="workspace-main">
        <Outlet />
      </main>
    </div>
  );
}
