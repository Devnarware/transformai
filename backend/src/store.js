// DEVELOPMENT FALLBACK STORE: JSON file persistence. Not for production; swap for MongoDB/Mongoose.
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
const F = path.resolve(process.env.DATA_FILE || 'data/db.json');
let db = { transformations: [], templates: [], settings: { audience: 'Senior Management', tone: 'Professional', language: 'English', detailLevel: 'Balanced', objective: 'Inform', style: 'Professional' } };
if (fs.existsSync(F)) db = { ...db, ...JSON.parse(fs.readFileSync(F, 'utf8')) };
const save = () => { fs.mkdirSync(path.dirname(F), { recursive: true }); fs.writeFileSync(F, JSON.stringify(db, null, 1)); };
export const col = n => ({
  list: () => db[n],
  get: id => db[n].find(x => x._id === id),
  add(o) { const d = { _id: randomUUID(), createdAt: new Date().toISOString(), ...o }; db[n].push(d); save(); return d; },
  update(id, p) { const d = this.get(id); if (d) { Object.assign(d, p, { updatedAt: new Date().toISOString() }); save(); } return d; },
  remove(id) { const l = db[n].length; db[n] = db[n].filter(x => x._id !== id); save(); return db[n].length < l; },
});
export const settings = { get: () => db.settings, set(p) { Object.assign(db.settings, p); save(); return db.settings; } };
