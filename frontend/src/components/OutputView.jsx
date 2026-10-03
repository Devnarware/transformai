const label = k => k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
export const toText = (v, i = '') => Array.isArray(v) ? v.map(x => typeof x === 'object' ? toText(x, i) + '\n' : `${i}- ${x}`).join('\n') : v && typeof v === 'object' ? Object.entries(v).map(([k, x]) => `${i}${label(k)}:\n${toText(x, i + '  ')}`).join('\n') : `${i}${v}`;
export default function V({ v }) {
  if (Array.isArray(v)) return v.every(x => typeof x !== 'object')
    ? <ul>{v.map((x, i) => <li key={i}>{x}</li>)}</ul>
    : <div className="grid">{v.map((x, i) => <div className="card" key={i}><b>#{String(i + 1).padStart(2, '0')}</b><V v={x} /></div>)}</div>;
  if (v && typeof v === 'object') return <>{Object.entries(v).map(([k, x]) => <div key={k}><h4>{label(k)}</h4><V v={x} /></div>)}</>;
  return <p>{String(v)}</p>;
}
