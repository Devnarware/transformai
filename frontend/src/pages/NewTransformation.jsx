import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, toast, OUTS, OPT, STAGES } from '../api';
export default function NewTransformation() {
  const nav = useNavigate(); const tpl = useLocation().state?.template;
  const [step, setStep] = useState(1); const [tab, setTab] = useState('Text');
  const [text, setText] = useState(''); const [title, setTitle] = useState(''); const [file, setFile] = useState(null); const [fstat, setFstat] = useState('');
  const [sel, setSel] = useState(tpl?.selectedOutputs || ['linkedin', 'summary', 'presentation']);
  const [cfg, setCfg] = useState(tpl?.settings || {}); const [stage, setStage] = useState(-1);
  useEffect(() => { if (!tpl) api.get('/settings').then(setCfg).catch(() => {}); }, []);
  const up = async f => { if (!f) return; setFile(f); setFstat('Processing…'); try { const r = await api.upload(f); setText(r.text); setTitle(r.title); setFstat(`Extracted ${r.metadata.characters} characters`); } catch (e) { setFstat('Failed'); toast(e.message); } };
  const sample = async () => { const s = await api.get('/sample'); setText(s.content); setTitle(s.title); setTab('Text'); };
  const go = async () => {
    try {
      const { transformationId: id } = await api.post('/transform', { sourceContent: text, sourceTitle: title || undefined, sourceType: file ? 'document' : 'text', selectedOutputs: sel, settings: cfg });
      setStage(0);
      const t = setInterval(async () => { try { const r = await api.get('/transformations/' + id); setStage(r.stage);
        if (r.status === 'completed') { clearInterval(t); nav('/history/' + id); } if (r.status === 'failed') { clearInterval(t); setStage(-1); toast(r.error || 'Failed'); } } catch (e) { clearInterval(t); toast(e.message); } }, 600);
    } catch (e) { toast(e.message); }
  };
  if (stage >= 0) return (<><h2>Processing</h2><p className="sub">Status is polled from the backend.</p><div className="card"><ul className="pl">{STAGES.map((s, i) => <li key={s} className={i < stage ? 'd' : i === stage ? 'a' : ''}>{i < stage ? '✓' : i === stage ? '→' : '○'} {s}</li>)}</ul></div></>);
  const F = (k, o) => <div key={k}><label>{k.replace(/([A-Z])/g, ' $1')}</label><select value={cfg[k] || o[0]} onChange={e => setCfg({ ...cfg, [k]: e.target.value })}>{o.map(x => <option key={x}>{x}</option>)}</select></div>;
  return (<><div className="crumb">Workspace / New Transformation</div><h2>New Transformation</h2><p className="sub"> </p>
    <div className="steps">{['Source', 'Outputs', 'Parameters'].map((s, i) => <div key={s} className={step === i + 1 ? 'on' : ''}>STEP {i + 1} — {s.toUpperCase()}</div>)}</div>
    {step === 1 && <div className="card"><div className="row">{['Text', 'Document', 'Image', 'Video'].map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}<button className="sm" onClick={sample}>Use Sample Report</button></div><br />
      {tab === 'Text' && <><label>Title (optional)</label><input value={title} onChange={e => setTitle(e.target.value)} /><br /><br /><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste an article, report, advisory or incident report here…" /><small>{text.length} characters (minimum 50)</small></>}
      {tab === 'Document' && <><input type="file" accept=".pdf,.docx,.txt" onChange={e => up(e.target.files[0])} />{file && <p>{file.name} · {file.name.split('.').pop().toUpperCase()} · {(file.size / 1024).toFixed(1)} KB · {fstat}</p>}{text && <p><small>Extracted text loaded. Switch to Text to review it.</small></p>}</>}
      {(tab === 'Image' || tab === 'Video') && <div className="note">{tab} ingestion (OCR / transcription) is coming soon. Use Text or Document for now.</div>}
      <br /><button className="p" disabled={text.trim().length < 50} onClick={() => setStep(2)}>Continue</button></div>}
    {step === 2 && <><p className="sub">{sel.length} selected</p><div className="grid">{OUTS.map(([k, n, d]) => <div key={k} className={'card opt ' + (sel.includes(k) ? 'on' : '')} role="checkbox" aria-checked={sel.includes(k)} tabIndex={0} onKeyDown={e => e.key === ' ' && setSel(sel.includes(k) ? sel.filter(x => x !== k) : [...sel, k])} onClick={() => setSel(sel.includes(k) ? sel.filter(x => x !== k) : [...sel, k])}><h3>{sel.includes(k) ? '☑' : '☐'} {n}</h3><p>{d}</p></div>)}</div>
      <button onClick={() => setStep(1)}>Back</button> <button className="p" disabled={!sel.length} onClick={() => setStep(3)}>Continue</button></>}
    {step === 3 && <><div className="card grid">{Object.entries(OPT).map(([k, o]) => F(k, o))}</div><button onClick={() => setStep(2)}>Back</button> <button className="p" onClick={go}>Generate Deliverables</button></>}</>);
}
