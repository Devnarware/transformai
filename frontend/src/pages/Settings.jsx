import { useEffect, useState } from 'react';
import { api, toast, OPT } from '../api';
export default function Settings({ health }) {
  const [s, setS] = useState();
  useEffect(() => { api.get('/settings').then(setS).catch(e => toast(e.message)); }, []);
  const save = async () => { try { setS(await api.put('/settings', s)); toast('Settings saved'); } catch (e) { toast(e.message); } };
  return (<><h2>Settings</h2><p className="sub">Defaults for new transformations. Saved on the backend.</p>
    {s && <div className="card grid">{Object.entries(OPT).map(([k, o]) => <div key={k}><label>Default {k.replace(/([A-Z])/g, ' $1')}</label><select value={s[k]} onChange={e => setS({ ...s, [k]: e.target.value })}>{o.map(x => <option key={x}>{x}</option>)}</select></div>)}</div>}
    <button className="p" onClick={save}>Save Settings</button>
    <div className="card" style={{ marginTop: 14 }}><h3>System</h3><p>Backend: {health?.status === 'ok' ? 'online' : 'offline'}</p><p>Database: {health?.database || 'unknown'}</p><p>AI provider: {health?.aiProvider || 'unknown'} {health?.demoMode ? '(Demo Mode — Local Transformation Engine)' : ''}</p><small>The provider is set with AI_PROVIDER on the server; no secrets are exposed here.</small></div></>);
}
