import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, toast, download, LABEL } from '../api';
import V, { toText } from '../components/OutputView';
export default function Detail() {
  const { id } = useParams(); const [t, setT] = useState(); const [tab, setTab] = useState('overview'); const [e, setE] = useState();
  const load = () => api.get('/transformations/' + id).then(setT).catch(x => setE(x.message));
  useEffect(() => { load(); }, [id]);
  if (e) return <div className="card failed">{e}</div>; if (!t) return <div className="skel" />;
  const o = t.generatedOutputs.find(x => x.type === tab);
  const copy = async () => { await navigator.clipboard.writeText(`${o.title}\n\n${toText(o.content)}`); toast('Copied'); };
  const regen = async () => { try { await api.post(`/transformations/${id}/regenerate`, { type: tab }); toast('Regenerated'); load(); } catch (x) { toast(x.message); } };
  const exp = async f => { try { download(await api.exportOut(id, tab, f), `${tab}.${f === 'json' ? 'json' : 'txt'}`); } catch (x) { toast(x.message); } };
  return (<><div className="crumb"><Link to="/history">History</Link> / {t.sourceTitle}</div><h2>Transformation {t.status === 'completed' ? 'Complete' : t.status}</h2>
    <p className="sub">{t.generatedOutputs.length} deliverables · Demo / Local Transformation Engine (not a live AI model)</p>
    <div className="row" style={{ marginBottom: 10 }}><button className={tab === 'overview' ? 'on' : ''} onClick={() => setTab('overview')}>Overview</button>{t.generatedOutputs.map(x => <button key={x.type} className={tab === x.type ? 'on' : ''} onClick={() => setTab(x.type)}>{LABEL[x.type]}</button>)}</div>
    {tab === 'overview' || !o ? <div className="card"><h3>{t.sourceTitle}</h3><div className="grid">{Object.entries(t.settings).map(([k, v]) => <div key={k}><label>{k}</label>{v}</div>)}</div>
      {t.analysis && <><h4>Context analysis</h4><p>Intent: {t.analysis.intent} · Risk: {t.analysis.severity} · Words: {t.analysis.wordCount}</p><p>Keywords: {t.analysis.keywords.join(', ')}</p></>}
      <h4>Quality validation</h4><ul>{t.generatedOutputs.map(x => <li key={x.type}>{x.title}: {x.metadata.validation.passed ? 'passed' : x.metadata.validation.issues.join(', ')} (v{x.version})</li>)}</ul></div>
      : <div className="card"><div className="row sp"><h3>{o.title}</h3><div className="row"><button className="sm" onClick={copy}>Copy</button><button className="sm" disabled title="Coming soon">Edit (soon)</button><button className="sm" onClick={regen}>Regenerate</button><button className="sm" onClick={() => exp('txt')}>Export .txt</button><button className="sm" onClick={() => exp('json')}>Export .json</button></div></div>
        <small>v{o.version} · {o.metadata.engine}{o.metadata.note ? ' · ' + o.metadata.note : ''}</small><V v={o.content} /></div>}</>);
}
