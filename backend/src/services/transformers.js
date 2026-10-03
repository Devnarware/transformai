const N = s => ({ Concise: 2, Balanced: 3, Detailed: 5 }[s.detailLevel] || 3);
const cap = w => w[0].toUpperCase() + w.slice(1);
const sh = (x = '', l = 200) => x.length > l ? x.slice(0, l - 1).trim() + '…' : x;
const ks = a => a.keySentences.length ? a.keySentences : [a.sentences[0] || 'No content'];
const acts = a => (a.actions.length ? a.actions : ks(a).slice(0, 3)).map(x => sh(x, 160));
export const LABELS = { linkedin: 'LinkedIn Post', twitter: 'X / Twitter Thread', advisory: 'Security Advisory', summary: 'Executive Summary', infographic: 'Infographic Content', presentation: 'Presentation', video: 'Video Package' };
export const TYPES = Object.keys(LABELS);
export const transformers = {
  linkedin: (a, s) => { const k = ks(a); return { hook: `${a.severity} risk: ${sh(k[0], 140)}`, body: k.slice(1, 1 + N(s)).map(x => sh(x, 220)).join(' ') || sh(k[0], 220), keyInsights: k.slice(0, N(s)).map(x => sh(x, 120)), callToAction: `Is your organization prepared? Share how your team approaches ${a.keywords[0] || 'this'}.`, hashtags: a.keywords.slice(0, 4).map(w => '#' + cap(w)) }; },
  twitter: (a, s) => { const k = ks(a); const tw = [sh(k[0], 250), ...k.slice(1, N(s)).map(x => sh(x, 250)), `Key actions: ${acts(a).slice(0, 2).map(x => sh(x, 70)).join('; ')}`]; return { tweets: tw.map((x, i) => `${i + 1}/${tw.length} ${x}`), hashtags: a.keywords.slice(0, 3).map(w => '#' + cap(w)) }; },
  advisory: (a, s, t) => ({ title: `Advisory: ${t}`, severity: a.severity, audience: s.audience || 'General', overview: sh(ks(a)[0], 300), threat: ks(a).slice(1, 3).map(x => sh(x, 250)), indicators: a.facts.length ? a.facts : a.keywords.slice(0, 5), impact: `Assessed risk level is ${a.severity}. Affected areas: ${a.keywords.slice(0, 4).join(', ')}.`, recommendedActions: acts(a) }),
  summary: (a, s, t) => ({ title: `Executive Summary — ${t}`, overview: sh(ks(a)[0], 300), keyFindings: ks(a).slice(0, N(s)).map(x => sh(x, 160)), importantDevelopments: ks(a).slice(1, 3).map(x => sh(x, 160)), implications: `Risk overview: ${a.severity}. Priority topics: ${a.keywords.slice(0, 3).join(', ')}.`, recommendedActions: acts(a) }),
  infographic: (a, s, t) => ({ title: t, mainMessage: sh(ks(a)[0], 140), sections: a.keywords.slice(0, N(s)).map((w, i) => ({ heading: cap(w), text: sh(ks(a)[i % ks(a).length], 120) })), keyFacts: a.facts.length ? a.facts : [`Words analysed: ${a.wordCount}`, `Risk level: ${a.severity}`], visualRecommendations: ['Vertical layout with numbered sections', 'One icon per section, navy/blue palette', 'Single callout for risk level'], callToAction: 'Report suspicious activity to your security team.' }),
  presentation: (a, s, t) => ({ slides: [
    { title: t, objective: 'Introduce the topic', points: [`Intent: ${a.intent}`, `Risk level: ${a.severity}`], speakerNotes: 'Open with scope and audience.' },
    { title: 'Key Findings', objective: 'Present findings', points: ks(a).slice(0, N(s)).map(x => sh(x, 140)), speakerNotes: 'Walk through each finding.' },
    { title: 'Key Themes', objective: 'Show recurring topics', points: a.keywords.slice(0, 5), speakerNotes: 'These terms recur most in the source.' },
    { title: 'Risks and Impact', objective: 'Link findings to impact', points: ks(a).slice(1, 3).map(x => sh(x, 140)), speakerNotes: 'Explain organizational impact.' },
    { title: 'Recommended Actions', objective: 'Agree next steps', points: acts(a), speakerNotes: 'Close with ownership and timeline.' }] }),
  video: (a, s, t) => { const scenes = ks(a).slice(0, 3).map((x, i) => ({ visual: ['Opening shot of a normal workday', 'Close-up of an on-screen example', 'Checklist overlay'][i], narration: sh(x, 180), onScreenText: cap(a.keywords[i] || 'Key point') }));
    return { videoTitle: `${t} — Awareness Video`, hook: sh(ks(a)[0], 100), script: scenes.map(x => x.narration).join(' '), storyboard: scenes, subtitles: scenes.map((x, i) => `00:${String(i * 10).padStart(2, '0')}–00:${String(i * 10 + 9).padStart(2, '0')}  ${sh(x.narration, 80)}`), visualRecommendations: ['Flat 2D motion graphics', 'Navy and blue palette', 'Large on-screen text for key terms'] }; },
};
export function validateOutput(type, c) {
  const issues = [];
  if (!c || !Object.keys(c).length) issues.push('Empty output');
  if (type === 'twitter' && c.tweets?.some(x => x.length > 280)) issues.push('Tweet exceeds 280 characters');
  if (JSON.stringify(c).includes('undefined')) issues.push('Undefined value in output');
  return { passed: !issues.length, issues };
}
