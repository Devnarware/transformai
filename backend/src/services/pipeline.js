import { col } from '../store.js';
import { analyze } from './analyzer.js';
import { generate, name as provider } from './ai/provider.js';
import { LABELS, validateOutput } from './transformers.js';
const T = col('transformations');
const wait = ms => new Promise(r => setTimeout(r, ms));
export const STAGES = ['Source received', 'Content analyzed', 'Context identified', 'Generating deliverables', 'Formatting outputs', 'Quality validation', 'Saving results'];
const rotate = (a, k) => { const n = a.keySentences.length || 1; const r = k % n; return { ...a, keySentences: [...a.keySentences.slice(r), ...a.keySentences.slice(0, r)] }; };
const firstLine = t => t.split('\n')[0].slice(0, 120);

async function build(type, a, tr, version) {
  const content = await generate(type, rotate(a, version - 1), tr.settings, tr.sourceTitle);
  const metadata = { engine: provider() === 'mock' ? 'Demo / Local Transformation Engine' : provider(), validation: validateOutput(type, content), ...tr.settings };
  if (tr.settings.language === 'Hindi') metadata.note = 'Demo engine does not translate; content is in English. Hindi needs a real provider.';
  return { type, title: LABELS[type], content, metadata, version, createdAt: new Date().toISOString() };
}
export function startTransform(body, { fast = false } = {}) {
  const tr = T.add({ sourceTitle: body.sourceTitle || firstLine(body.sourceContent), sourceType: body.sourceType || 'text', sourceContent: body.sourceContent, sourceMetadata: body.sourceMetadata || {}, settings: body.settings || {}, selectedOutputs: body.selectedOutputs, status: 'queued', stage: 0, generatedOutputs: [] });
  return { tr, done: run(tr._id, fast) };
}
async function run(id, fast) {
  const d = () => wait(fast ? 0 : 700);
  const tr = T.get(id);
  try {
    T.update(id, { status: 'processing', stage: 1 }); await d();
    const a = analyze(tr.sourceContent); T.update(id, { stage: 2, analysis: a }); await d();
    T.update(id, { stage: 3 }); await d();
    const outs = []; for (const type of tr.selectedOutputs) outs.push(await build(type, a, tr, 1));
    T.update(id, { stage: 4 }); await d();
    T.update(id, { stage: 5 }); await d();
    T.update(id, { stage: 6, generatedOutputs: outs }); await d();
    T.update(id, { status: 'completed', stage: 7 });
  } catch (e) { T.update(id, { status: 'failed', error: e.message }); }
}
export async function regenerate(tr, type) {
  const old = tr.generatedOutputs.find(o => o.type === type);
  const out = await build(type, tr.analysis || analyze(tr.sourceContent), tr, (old?.version || 0) + 1);
  T.update(tr._id, { generatedOutputs: [...tr.generatedOutputs.filter(o => o.type !== type), out] });
  return out;
}
