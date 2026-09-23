import axios from 'axios';
import type { Analysis } from './types';

export const API_BASE = 'https://resume-backend-eo9x.onrender.com';

const SYSTEM_PROMPT = `You are an experienced technical recruiter and CV coach.
Analyse the CV you are given and reply with ONLY a JSON object with exactly these keys:
{
  "name": string, "email": string, "phone": string, "location": string,
  "experience_years": number,
  "overall_score": number (0-100),
  "section_scores": { "impact": number, "clarity": number, "skills": number, "ats_formatting": number } (each 0-100),
  "summary": string (2-3 sentences, plain and honest),
  "skills": string[], "education": string[],
  "strengths": string[] (3-5, specific to this CV),
  "weaknesses": string[] (3-5, specific and fixable),
  "bullet_rewrites": [{ "original": string, "improved": string }] (the 3 weakest bullet points, rewritten with action verbs and measurable impact; never invent numbers, use [X] as a placeholder where a figure is needed),
  "job_match": null OR { "score": number (0-100), "matched_keywords": string[], "missing_keywords": string[], "tailoring_tips": string[] },
  "recommendation": string (one short paragraph)
}
Use "" for missing contact details. Only fill "job_match" when a job description is provided, otherwise null.
Be fair and calibrated: a solid student CV usually scores 55-75. Do not flatter.`;

export class AnalysisError extends Error {}

function friendlyOpenAIError(status: number, body: any): string {
  const code = body?.error?.code ?? '';
  const msg = body?.error?.message ?? '';
  if (status === 401) return 'That API key was rejected. Check it in settings.';
  if (status === 429 && (code === 'insufficient_quota' || /quota/i.test(msg)))
    return 'Your OpenAI account is out of credit. Add billing at platform.openai.com.';
  if (status === 429) return 'OpenAI is rate limiting requests. Wait a moment and try again.';
  if (status === 404 || code === 'model_not_found')
    return 'That model isn’t available on your account. Change the model in settings.';
  return msg || `OpenAI returned an error (${status}).`;
}

/** Calls OpenAI directly from the browser with the user's own key. */
export async function analyzeWithOwnKey(
  cvText: string,
  jobDescription: string,
  apiKey: string,
  model: string,
): Promise<Analysis> {
  const userContent =
    `CV:\n"""\n${cvText}\n"""` +
    (jobDescription.trim()
      ? `\n\nJob description:\n"""\n${jobDescription.trim().slice(0, 8000)}\n"""`
      : '\n\nNo job description provided.');

  let res: Response;
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    });
  } catch {
    throw new AnalysisError('Couldn’t reach OpenAI. Check your internet connection.');
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new AnalysisError(friendlyOpenAIError(res.status, body));

  try {
    return normalize(JSON.parse(body.choices[0].message.content));
  } catch {
    throw new AnalysisError('The AI response couldn’t be read. Try again.');
  }
}

/** Quick check that a key works before the user uploads anything. */
export async function testKey(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) return null;
    return friendlyOpenAIError(res.status, await res.json().catch(() => ({})));
  } catch {
    return 'Couldn’t reach OpenAI. Check your internet connection.';
  }
}

/** Fallback for visitors without a key: the original hosted backend. */
export async function analyzeWithServer(file: File): Promise<Analysis> {
  const form = new FormData();
  form.append('file', file);
  let id: string;
  try {
    const res = await axios.post(`${API_BASE}/upload-resume`, form, { timeout: 90000 });
    id = res.data.id;
  } catch (e) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED')
      throw new AnalysisError('The demo server took too long. It may be waking up, so try again in a minute, or add your own API key.');
    throw new AnalysisError('The demo server isn’t available right now. Add your own OpenAI key in settings to analyse instantly.');
  }

  for (let attempt = 0; attempt < 45; attempt++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const { data } = await axios.get(`${API_BASE}/resume/${id}`, { timeout: 30000 });
      if (data.status === 'completed') return normalize({ ...data.analysis, overall_score: data.score });
      if (data.status === 'error') throw new AnalysisError('The demo server couldn’t analyse this CV.');
    } catch (e) {
      if (e instanceof AnalysisError) throw e;
    }
  }
  throw new AnalysisError('The demo server timed out. Try adding your own API key.');
}

const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
};
const list = (v: unknown) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);

/** Makes any response safe to render, whatever shape it arrives in. */
function normalize(raw: any): Analysis {
  const jm = raw?.job_match;
  return {
    name: String(raw?.name ?? ''),
    email: String(raw?.email ?? ''),
    phone: String(raw?.phone ?? ''),
    location: String(raw?.location ?? ''),
    experience_years: Number(raw?.experience_years) || 0,
    overall_score: num(raw?.overall_score ?? raw?.score),
    section_scores: raw?.section_scores
      ? {
          impact: num(raw.section_scores.impact),
          clarity: num(raw.section_scores.clarity),
          skills: num(raw.section_scores.skills),
          ats_formatting: num(raw.section_scores.ats_formatting),
        }
      : undefined,
    summary: raw?.summary ? String(raw.summary) : undefined,
    skills: list(raw?.skills),
    education: list(raw?.education),
    strengths: list(raw?.strengths),
    weaknesses: list(raw?.weaknesses),
    bullet_rewrites: Array.isArray(raw?.bullet_rewrites)
      ? raw.bullet_rewrites
          .filter((b: any) => b?.original && b?.improved)
          .map((b: any) => ({ original: String(b.original), improved: String(b.improved) }))
      : undefined,
    job_match: jm
      ? {
          score: num(jm.score),
          matched_keywords: list(jm.matched_keywords),
          missing_keywords: list(jm.missing_keywords),
          tailoring_tips: list(jm.tailoring_tips),
        }
      : null,
    recommendation: String(raw?.recommendation ?? ''),
  };
}
