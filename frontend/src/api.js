const j = async r => { const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Request failed'); return d; };
const BASE = import.meta.env.VITE_API_URL || '';
const req = (m, u, b) => fetch(BASE + '/api' + u, { method: m, headers: b ? { 'Content-Type': 'application/json' } : {}, body: b ? JSON.stringify(b) : undefined }).then(j);
export const api = {
  get: u => req('GET', u), post: (u, b) => req('POST', u, b || {}), put: (u, b) => req('PUT', u, b), del: u => req('DELETE', u),
  upload: f => { const fd = new FormData(); fd.append('file', f); return fetch(BASE + '/api/content/upload', { method: 'POST', body: fd }).then(j); },
  exportOut: async (id, type, format) => { const r = await fetch(`${BASE}/api/transformations/${id}/export`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, format }) }); if (!r.ok) throw new Error('Export failed'); return r.blob(); },
};
export const toast = m => { const d = document.createElement('div'); d.className = 'toast'; d.textContent = m; document.body.append(d); setTimeout(() => d.remove(), 2600); };
export const download = (b, n) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = n; a.click(); };
export const OUTS = [['linkedin', 'LinkedIn Post', 'Professional social post.'], ['twitter', 'X / Twitter', 'Post or numbered thread.'], ['advisory', 'Advisory', 'Findings and recommendations.'], ['summary', 'Executive Summary', 'Briefing for decision-makers.'], ['infographic', 'Infographic', 'Key messages and layout.'], ['presentation', 'Presentation', 'Slides with speaker notes.'], ['video', 'Video Package', 'Script, storyboard, subtitles.']];
export const LABEL = Object.fromEntries(OUTS.map(o => [o[0], o[1]]));
export const OPT = { audience: ['General Public', 'Technical Team', 'Senior Management', 'Security Personnel', 'Policy Makers', 'Students'], tone: ['Professional', 'Formal', 'Informative', 'Concise', 'Technical'], language: ['English', 'Hindi'], detailLevel: ['Concise', 'Balanced', 'Detailed'], objective: ['Inform', 'Summarize', 'Educate', 'Alert', 'Promote', 'Brief Decision Makers'], style: ['Professional', 'Technical', 'Executive', 'Public Communication'] };
export const STAGES = ['Source received', 'Content analyzed', 'Context identified', 'Generating deliverables', 'Formatting outputs', 'Quality validation', 'Saving results'];
export const fmt = d => new Date(d).toLocaleString();
