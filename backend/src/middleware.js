import { TYPES } from './services/transformers.js';
export class HttpError extends Error { constructor(s, m) { super(m); this.status = s; } }
export const errorHandler = (e, q, r, n) => {
  const s = e.status || (e.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
  if (s === 500) console.error(e);
  r.status(s).json({ error: s === 500 ? 'Internal server error' : e.message });
};
export function validateTransform(b = {}) {
  const c = b.sourceContent;
  if (typeof c !== 'string' || c.trim().length < 50) throw new HttpError(400, 'sourceContent must be at least 50 characters');
  if (c.length > 200000) throw new HttpError(400, 'sourceContent too long');
  if (!Array.isArray(b.selectedOutputs) || !b.selectedOutputs.length || !b.selectedOutputs.every(t => TYPES.includes(t)))
    throw new HttpError(400, `selectedOutputs must be a non-empty subset of: ${TYPES.join(', ')}`);
  const st = {};
  for (const k of ['audience', 'tone', 'language', 'detailLevel', 'objective', 'style'])
    if (b.settings?.[k] != null) st[k] = String(b.settings[k]).slice(0, 60);
  return { sourceContent: c.trim(), sourceType: String(b.sourceType || 'text'), sourceTitle: b.sourceTitle ? String(b.sourceTitle).slice(0, 200) : undefined,
    sourceMetadata: b.sourceMetadata || {}, selectedOutputs: [...new Set(b.selectedOutputs)], settings: st };
}
