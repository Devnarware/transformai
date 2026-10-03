import { col, settings } from './store.js';
import { HttpError, validateTransform } from './middleware.js';
import { startTransform, regenerate } from './services/pipeline.js';
import { extractText } from './services/ingestion.js';
import { name as provider } from './services/ai/provider.js';
import { TYPES } from './services/transformers.js';
import { sample as smp } from './utils/sample.js';
const T = col('transformations'), TP = col('templates');
const a = f => (q, r, n) => Promise.resolve().then(() => f(q, r)).catch(n);
const find = (c, id) => { const d = c.get(id); if (!d) throw new HttpError(404, 'Not found'); return d; };
const toText = (v, i = '') => Array.isArray(v) ? v.map(x => typeof x === 'object' ? toText(x, i) + '\n' : `${i}- ${x}`).join('\n') : v && typeof v === 'object' ? Object.entries(v).map(([k, x]) => `${i}${k.toUpperCase()}:\n${toText(x, i + '  ')}`).join('\n') : `${i}${v}`;

export const health = a((q, r) => r.json({ status: 'ok', database: 'local-json (development fallback)', aiProvider: provider(), demoMode: provider() === 'mock', environment: process.env.NODE_ENV || 'development' }));
export const sample = a((q, r) => r.json(smp));
export const stats = a((q, r) => { const l = T.list(); r.json({ total: l.length, completed: l.filter(x => x.status === 'completed').length, outputs: l.reduce((n, x) => n + x.generatedOutputs.length, 0), templates: TP.list().length }); });
export const upload = a(async (q, r) => {
  if (!q.file) throw new HttpError(400, 'No file uploaded (field name: file)');
  const text = await extractText(q.file);
  r.json({ text, title: q.file.originalname.replace(/\.[^.]+$/, ''), metadata: { fileName: q.file.originalname, fileType: q.file.originalname.split('.').pop().toLowerCase(), size: q.file.size, characters: text.length } });
});
export const transform = a((q, r) => { const b = validateTransform(q.body); const { tr } = startTransform({ ...b, settings: { ...settings.get(), ...b.settings } }); r.status(202).json({ transformationId: tr._id, status: tr.status }); });
export const list = a((q, r) => r.json([...T.list()].reverse().map(({ _id, sourceTitle, sourceType, selectedOutputs, status, stage, createdAt }) => ({ _id, sourceTitle, sourceType, selectedOutputs, status, stage, createdAt }))));
export const get = a((q, r) => r.json(find(T, q.params.id)));
export const remove = a((q, r) => { find(T, q.params.id); T.remove(q.params.id); r.json({ deleted: true }); });
export const regen = a(async (q, r) => { const t = find(T, q.params.id); const type = q.body?.type; if (!TYPES.includes(type) || !t.selectedOutputs.includes(type)) throw new HttpError(400, 'Invalid output type'); r.json(await regenerate(t, type)); });
export const exportOut = a((q, r) => {
  const t = find(T, q.params.id), type = q.body?.type, o = t.generatedOutputs.find(x => x.type === type);
  if (!o) throw new HttpError(404, 'Output not found');
  const json = q.body.format === 'json';
  r.setHeader('Content-Disposition', `attachment; filename="${type}.${json ? 'json' : 'txt'}"`);
  r.type(json ? 'json' : 'text').send(json ? JSON.stringify(o.content, null, 2) : `${o.title}\n\n${toText(o.content)}`);
});
const tBody = b => { if (!b?.name || typeof b.name !== 'string') throw new HttpError(400, 'name is required'); if (!Array.isArray(b.selectedOutputs) || !b.selectedOutputs.every(t => TYPES.includes(t))) throw new HttpError(400, 'Invalid selectedOutputs'); return { name: b.name.slice(0, 80), description: String(b.description || '').slice(0, 200), selectedOutputs: b.selectedOutputs, settings: b.settings || {} }; };
export const tList = a((q, r) => r.json(TP.list()));
export const tCreate = a((q, r) => r.status(201).json(TP.add(tBody(q.body))));
export const tUpdate = a((q, r) => { find(TP, q.params.id); r.json(TP.update(q.params.id, tBody(q.body))); });
export const tDelete = a((q, r) => { find(TP, q.params.id); TP.remove(q.params.id); r.json({ deleted: true }); });
export const getSettings = a((q, r) => r.json(settings.get()));
export const putSettings = a((q, r) => { const p = {}; for (const k of ['audience', 'tone', 'language', 'detailLevel', 'objective', 'style']) if (q.body?.[k]) p[k] = String(q.body[k]).slice(0, 60); r.json(settings.set(p)); });
