import path from 'path';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { HttpError } from '../middleware.js';
export async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.mp4'].includes(ext)) throw new HttpError(415, 'Image/video ingestion (OCR, transcription) is coming soon. Upload PDF, DOCX or TXT.');
  if (!['.pdf', '.docx', '.txt'].includes(ext)) throw new HttpError(415, 'Unsupported file type. Use PDF, DOCX or TXT.');
  let text;
  if (ext === '.pdf') text = (await pdf(file.buffer)).text;
  else if (ext === '.docx') text = (await mammoth.extractRawText({ buffer: file.buffer })).value;
  else text = file.buffer.toString('utf8');
  text = text.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length < 50) throw new HttpError(422, 'Could not extract enough text from the file');
  return text;
}
