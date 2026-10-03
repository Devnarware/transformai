import { MessageSquare, Presentation, List } from 'lucide-react';

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

export const toText = (val, indent = '') => {
  if (Array.isArray(val)) {
    return val
      .map((item) =>
        typeof item === 'object' && item !== null
          ? toText(item, indent) + '\n'
          : `${indent}• ${item}`
      )
      .join('\n');
  }
  if (val && typeof val === 'object') {
    return Object.entries(val)
      .map(([k, v]) => `${indent}${formatLabel(k)}:\n${toText(v, indent + '  ')}`)
      .join('\n');
  }
  return `${indent}${val}`;
};

export default function OutputView({ v }) {
  if (!v) return null;

  // Case 1: Array of objects (e.g. presentation slides, thread items)
  if (Array.isArray(v)) {
    // Array of plain strings
    if (v.every((item) => typeof item !== 'object' || item === null)) {
      return (
        <ul style={{ margin: '8px 0', paddingLeft: 22 }}>
          {v.map((str, idx) => (
            <li key={idx} style={{ marginBottom: 6, color: 'var(--text-primary)' }}>
              {str}
            </li>
          ))}
        </ul>
      );
    }

    // Array of complex objects (slides or sections)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
        {v.map((item, idx) => (
          <div key={idx} className="slide-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
                paddingBottom: 6,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Item #{String(idx + 1).padStart(2, '0')}
              </span>
            </div>
            <OutputView v={item} />
          </div>
        ))}
      </div>
    );
  }

  // Case 2: Object dictionary
  if (typeof v === 'object') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(v).map(([propKey, propVal]) => (
          <div key={propKey}>
            <span
              style={{
                display: 'block',
                fontSize: 11.5,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: 4,
              }}
            >
              {formatLabel(propKey)}
            </span>
            <div style={{ paddingLeft: 2 }}>
              <OutputView v={propVal} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Case 3: Plain text / numbers
  return (
    <p style={{ margin: '0 0 6px', fontSize: 13.5, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
      {String(v)}
    </p>
  );
}
