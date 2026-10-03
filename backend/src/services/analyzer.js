const STOP = new Set('the and for with that this from have has will can may not but which into more than also such these those their they are was were been being them then when where while about after before using used use'.split(' '));
export function analyze(raw) {
  const text = raw.replace(/\s+/g, ' ').trim();
  const sentences = (text.match(/[^.!?]+[.!?]/g) || [text]).map(s => s.trim()).filter(s => s.length > 25);
  const freq = {};
  (text.toLowerCase().match(/[a-z]{4,}/g) || []).forEach(w => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);
  const score = s => keywords.reduce((n, k) => n + (s.toLowerCase().includes(k) ? 1 : 0), 0);
  const keySentences = [...sentences].sort((a, b) => score(b) - score(a)).slice(0, 6);
  const l = text.toLowerCase();
  const severity = /critical|ransomware|breach|zero-day|exploit/.test(l) ? 'High' : /phish|malware|vulnerab|attack|threat|risk/.test(l) ? 'Medium–High' : 'Low–Medium';
  const actions = sentences.filter(s => /recommend|should|must|ensure|implement|enable|measures/i.test(s));
  const facts = text.match(/\b\d+(\.\d+)?\s?(%|percent|times|incidents|campaigns|organizations)/gi) || [];
  const intent = /recommend|should|measures/i.test(text) ? 'Advisory / awareness' : 'Informational';
  return { sentences, keywords, keySentences, severity, actions, facts, intent, wordCount: text.split(' ').length };
}
