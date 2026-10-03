import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, toast, OUTS } from '../api';
export default function Templates() {
  const nav = useNavigate(); const [l, setL] = useState(); const [n, setN] = useState(''); const [sel, setSel] = useState(['summary']);
  const load = () => api.get('/templates').then(setL).catch(e => toast(e.message));
  useEffect(() => { load(); }, []);
  const add = async () => { try { await api.post('/templates', { name: n, selectedOutputs: sel, settings: await api.get('/settings') }); setN(''); toast('Template created'); load(); } catch (e) { toast(e.message); } };
  const del = async t => { if (window.confirm(`Delete template "${t.name}"?`)) { await api.del('/templates/' + t._id); load(); } };
  return (<><h2>Templates</h2><p className="sub">Reusable output and parameter presets.</p>
    <div className="card"><h3>Create Template</h3><label>Name</label><input value={n} onChange={e => setN(e.target.value)} /><div className="row" style={{ margin: '8px 0' }}>{OUTS.map(([k, name]) => <label key={k} style={{ display: 'inline' }}><input type="checkbox" style={{ width: 'auto' }} checked={sel.includes(k)} onChange={() => setSel(sel.includes(k) ? sel.filter(x => x !== k) : [...sel, k])} /> {name}</label>)}</div><p><small>Uses your current default settings.</small></p><button className="p" disabled={!n || !sel.length} onClick={add}>Create</button></div>
    <div className="grid">{!l ? <div className="skel" /> : l.map(t => <div className="card" key={t._id}><h3>{t.name}</h3><p>{t.selectedOutputs.join(', ')}</p><p><small>{t.settings.audience} · {t.settings.tone}</small></p><div className="row"><button className="sm p" onClick={() => nav('/new', { state: { template: t } })}>Use Template</button><button className="sm" onClick={() => del(t)}>Delete</button></div></div>)}</div></>);
}
