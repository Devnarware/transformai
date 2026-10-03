import { col } from './store.js';
import { startTransform } from './services/pipeline.js';
import { TYPES } from './services/transformers.js';
import { sample } from './utils/sample.js';
export async function seed() {
  if (!col('templates').list().length) {
    const s = { audience: 'Senior Management', tone: 'Professional', language: 'English', detailLevel: 'Balanced', objective: 'Inform', style: 'Professional' };
    [['Security Advisory', ['advisory', 'summary'], { ...s, audience: 'Security Personnel', tone: 'Technical', objective: 'Alert' }],
     ['Executive Briefing', ['summary', 'presentation'], { ...s, objective: 'Brief Decision Makers', style: 'Executive' }],
     ['Social Media Campaign', ['linkedin', 'twitter', 'infographic'], { ...s, audience: 'General Public', tone: 'Informative', style: 'Public Communication' }],
     ['Threat Intelligence Summary', ['summary', 'advisory'], { ...s, audience: 'Technical Team', tone: 'Technical', detailLevel: 'Detailed' }],
     ['Research Presentation', ['presentation', 'video'], { ...s, audience: 'Students', objective: 'Educate' }]]
      .forEach(([name, selectedOutputs, settings]) => col('templates').add({ name, description: `${name} preset`, selectedOutputs, settings }));
  }
  if (!col('transformations').list().length) {
    const { done } = startTransform({ sourceTitle: sample.title, sourceContent: sample.content, selectedOutputs: TYPES, settings: {} }, { fast: true });
    await done;
    const { done: d2 } = startTransform({ sourceTitle: 'Quarterly Threat Brief', sourceContent: sample.content, selectedOutputs: ['linkedin', 'summary', 'presentation'], settings: { audience: 'Senior Management' } }, { fast: true });
    await d2;
  }
}
