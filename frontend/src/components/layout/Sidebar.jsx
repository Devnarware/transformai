import {
  LayoutDashboard,
  Wand2,
  Clock3,
  Layers,
  Settings,
  Sparkles,
  Lock,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: 'New Transformation',
    icon: Wand2,
    path: '/new',
  },
  {
    label: 'Transformation History',
    icon: Clock3,
    path: '/history',
  },
  {
    label: 'Templates',
    icon: Layers,
    path: '/templates',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export default function Sidebar({ health }) {
  const isDemo = health?.demoMode ?? true;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="brand-badge-icon">
          <Sparkles size={20} strokeWidth={2.2} />
        </div>
        <div className="brand-text">
          <strong>TransformAI</strong>
          <span>Multi-Deliverable Engine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-section-title">NAVIGATION</div>

        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="privacy-badge">
          <Lock size={15} className="privacy-icon" />
          <div>
            <strong>{isDemo ? 'Local Engine Mode' : 'AI Engine Mode'}</strong>
            <small>
              {isDemo
                ? 'Deterministic processing with zero cloud leakage'
                : 'Connected to configured AI inference provider'}
            </small>
          </div>
        </div>

        <div className="version-tag">
          <span>TransformAI v1.0</span>
          <span className="version-dot"></span>
          <span>SIH26154</span>
        </div>
      </div>
    </aside>
  );
}
