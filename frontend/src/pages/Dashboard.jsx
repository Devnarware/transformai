import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fmt, LABEL } from '../api';
export default function Dashboard() {
  const [s, setS] = useState(); const [l, setL] = useState(); const [e, setE] = useState();
  useEffect(() => { Promise.all([api.get('/dashboard/stats'), api.get('/transformations')]).then(([a, b]) => { setS(a); setL(b.slice(0, 5)); }).catch(x => setE(x.message)); }, []);
  const h = new Date().getHours();
  if (e) return <div className="card failed">Could not load dashboard: {e}. Is the backend running?</div>;
  return (<><h2>{h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}</h2><p className="sub">Transform information into communication-ready deliverables.</p>
    <p><Link className="btn p" to="/new">+ New Transformation</Link></p>
    {!s ? <div className="skel" /> : <div className="grid">{[['Total Transformations', s.total], ['Completed', s.completed], ['Outputs Generated', s.outputs], ['Templates', s.templates]].map(([k, v]) => <div className="card stat" key={k}><b>{v}</b><span>{k}</span></div>)}</div>}
    <div className="card"><h3>Recent Transformations</h3>{!l ? <div className="skel" /> : !l.length ? <p>No transformations yet.</p> :
      <table><tbody>{l.map(t => <tr key={t._id}><td>{t.sourceTitle}</td><td>{t.sourceType}</td><td>{t.selectedOutputs.map(o => LABEL[o]).join(', ')}</td><td className={t.status}>{t.status}</td><td>{fmt(t.createdAt)}</td><td><Link className="btn sm" to={`/history/${t._id}`}>Open</Link></td></tr>)}</tbody></table>}</div></>);
}
