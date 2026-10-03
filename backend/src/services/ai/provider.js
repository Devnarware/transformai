// Provider abstraction. To add a real LLM: create e.g. openaiProvider.js exporting generate(type, analysis, settings, title)
// returning the same structured object, then register it below. API keys stay server-side in env vars.
import * as mock from './mockProvider.js';
const providers = { mock };
export const name = () => process.env.AI_PROVIDER || 'mock';
export async function generate(...args) {
  const p = providers[name()];
  if (!p) throw new Error(`AI_PROVIDER "${name()}" is not implemented. Available: ${Object.keys(providers).join(', ')}`);
  return p.generate(...args);
}
