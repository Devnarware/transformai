import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
process.env.DATA_FILE = '/tmp/transformai-test.json';
fs.rmSync(process.env.DATA_FILE, { force: true });
const { startTransform, regenerate } = await import('../src/services/pipeline.js');
const { sample } = await import('../src/utils/sample.js');
const { TYPES } = await import('../src/services/transformers.js');
const { col } = await import('../src/store.js');
test('pipeline generates and validates all 7 outputs, and regenerate bumps version', async () => {
  const { tr, done } = startTransform({ sourceContent: sample.content, selectedOutputs: TYPES, settings: { detailLevel: 'Balanced' } }, { fast: true });
  await done;
  const r = col('transformations').get(tr._id);
  assert.equal(r.status, 'completed');
  assert.equal(r.generatedOutputs.length, 7);
  r.generatedOutputs.forEach(o => assert.ok(o.metadata.validation.passed, o.type));
  assert.equal((await regenerate(r, 'linkedin')).version, 2);
});
