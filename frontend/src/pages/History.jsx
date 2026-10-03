import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fmt, toast, LABEL, OUTS } from '../api';
export default function History() {
  const [l, setL] = useState(); const [q, setQ] = useState(''); const [st, setSt] = useState(''); const [ty, setTy] = useState(''); const [asc, setAsc] = useState(false);
  const load = () => api.get('/transformations').then(setL).catch(e => toast(e.message));
  useEffect(() => { load(); }, []);
  const del = async t => { if (!window.confirm(`Delete "${t.sourceTitle}"?`)) return; try { await api.del('/transformations/' + t._id); toast('Deleted'); load(); } catch (e) { toast(e.message); } };
  const rows = (l || []).filter(t => t.sourceTitle.toLowerCase().includes(q.toLowerCase()) && (!st || t.status === st) && (!ty || t.selectedOutputs.includes(ty))).sort((a, b) => (asc ? 1 : -1) * (new Date(a.createdAt) - new Date(b.createdAt)));
  return (<><h2>History</h2><p className="sub">All transformations stored by the backend.</p>
    <div className="card row"><input style={{ width: 220 }} placeholder="Search title" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
      <select style={{ width: 150 }} value={st} onChange={e => setSt(e.target.value)}><option value="">All statuses</option>{['queued', 'processing', 'completed', 'failed'].map(s => <option key={s}>{s}</option>)}</select>
      <select style={{ width: 170 }} value={ty} onChange={e => setTy(e.target.value)}><option value="">All outputs</option>{OUTS.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select>
      <button onClick={() => setAsc(!asc)}>Date {asc ? '↑' : '↓'}</button></div>
    <div className="card">{!l ? <div className="skel" /> : !rows.length ? <p>No transformations match.</p> : <table><thead><tr><th>Title</th><th>Source</th><th>Outputs</th><th>Status</th><th>Created</th><th /></tr></thead><tbody>{rows.map(t => <tr key={t._id}><td>{t.sourceTitle}</td><td>{t.sourceType}</td><td>{t.selectedOutputs.map(o => LABEL[o]).join(', ')}</td><td className={t.status}>{t.status}</td><td>{fmt(t.createdAt)}</td><td className="row"><Link className="btn sm" to={`/history/${t._id}`}>Open</Link><button className="sm" onClick={() => del(t)}>Delete</button></td></tr>)}</tbody></table>}</div></>);
}
