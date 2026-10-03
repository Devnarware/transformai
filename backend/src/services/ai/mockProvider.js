import { transformers } from '../transformers.js';
export const generate = async (type, analysis, settings, title) => transformers[type](analysis, settings, title);
