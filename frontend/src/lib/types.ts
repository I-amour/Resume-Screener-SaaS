export type Status = 'processing' | 'completed' | 'error';

export interface JobMatch {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  tailoring_tips: string[];
}

export interface BulletRewrite {
  original: string;
  improved: string;
}

export interface Analysis {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience_years: number;
  overall_score: number;
  section_scores?: { impact: number; clarity: number; skills: number; ats_formatting: number };
  summary?: string;
  skills: string[];
  education: string[];
  strengths: string[];
  weaknesses: string[];
  bullet_rewrites?: BulletRewrite[];
  job_match?: JobMatch | null;
  recommendation: string;
}

export interface ResumeResult {
  id: string;
  filename: string;
  status: Status;
  uploadedAt: string;
  source: 'own-key' | 'demo-server' | 'example';
  withJobDescription: boolean;
  analysis?: Analysis;
  error?: string;
}
