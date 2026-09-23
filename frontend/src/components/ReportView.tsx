import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, Award, GraduationCap, CheckCircle,
  AlertTriangle, Target, Wand2, Download, Copy, Check, Star,
} from 'lucide-react';
import type { ResumeResult } from '../lib/types';
import { downloadMarkdown, toMarkdown } from '../lib/report';

const ringHex = (s: number) => (s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#f43f5e');
const barColor = (s: number) =>
  s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : 'bg-rose-500';

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label={`${label}: ${score} out of 100`}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="#ede9fe" strokeWidth="8" />
        <circle
          cx="44" cy="44" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
          stroke={ringHex(score)}
          strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="50" textAnchor="middle" className="fill-gray-800" fontSize="20" fontWeight="700">{score}</text>
      </svg>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

function Section({ icon, title, children, tint }: { icon: React.ReactNode; title: string; children: React.ReactNode; tint: string }) {
  return (
    <section className={`${tint} p-4 rounded-xl`}>
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">{icon}<span className="ml-2">{title}</span></h3>
      {children}
    </section>
  );
}

export default function ReportView({ result }: { result: ResumeResult }) {
  const [copied, setCopied] = useState(false);
  const a = result.analysis!;
  const jm = a.job_match;
  const missing = new Set(jm?.missing_keywords.map((k) => k.toLowerCase()));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="space-y-5">
      {/* Scores */}
      <div className="flex flex-wrap items-center gap-6">
        <ScoreRing score={a.overall_score} label="Overall" />
        {jm && <ScoreRing score={jm.score} label="Job match" />}
        {a.section_scores && (
          <div className="flex-1 min-w-[200px] space-y-2">
            {([
              ['Impact', a.section_scores.impact],
              ['Clarity', a.section_scores.clarity],
              ['Skills', a.section_scores.skills],
              ['ATS formatting', a.section_scores.ats_formatting],
            ] as const).map(([label, v]) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-gray-600 mb-0.5"><span>{label}</span><span>{v}</span></div>
                <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor(v)} rounded-full`} style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {a.summary && <p className="text-gray-700 leading-relaxed">{a.summary}</p>}

      <div className="flex gap-2">
        <button onClick={() => downloadMarkdown(result)} className="inline-flex items-center text-sm px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50">
          <Download className="h-4 w-4 mr-1.5" /> Download report
        </button>
        <button onClick={copy} className="inline-flex items-center text-sm px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50">
          {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {jm && (
        <Section icon={<Target className="h-4 w-4 text-purple-500" />} title="Match with the job description" tint="bg-gradient-to-r from-purple-50 to-pink-50">
          {jm.missing_keywords.length > 0 && (
            <>
              <p className="text-sm font-medium text-gray-700 mb-2">Missing from your CV</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {jm.missing_keywords.map((k) => (
                  <span key={k} className="px-3 py-1 bg-white rounded-full text-sm text-rose-700 border border-rose-200">{k}</span>
                ))}
              </div>
            </>
          )}
          {jm.matched_keywords.length > 0 && (
            <>
              <p className="text-sm font-medium text-gray-700 mb-2">Already covered</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {jm.matched_keywords.map((k) => (
                  <span key={k} className="px-3 py-1 bg-white rounded-full text-sm text-emerald-700 border border-emerald-200">{k}</span>
                ))}
              </div>
            </>
          )}
          {jm.tailoring_tips.length > 0 && (
            <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
              {jm.tailoring_tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </Section>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Section icon={<CheckCircle className="h-4 w-4 text-emerald-500" />} title="Strengths" tint="bg-gradient-to-r from-green-50 to-emerald-50">
          <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">{a.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </Section>
        <Section icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} title="To improve" tint="bg-gradient-to-r from-amber-50 to-orange-50">
          <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">{a.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </Section>
      </div>

      {a.bullet_rewrites && a.bullet_rewrites.length > 0 && (
        <Section icon={<Wand2 className="h-4 w-4 text-purple-500" />} title="Suggested rewrites" tint="bg-white border border-purple-100">
          <div className="space-y-4">
            {a.bullet_rewrites.map((b, i) => (
              <div key={i} className="text-sm">
                <p className="text-gray-500 line-through decoration-rose-300">{b.original}</p>
                <p className="text-gray-800 mt-1">{b.improved}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">[X] marks where you should add a real figure.</p>
        </Section>
      )}

      <Section icon={<Award className="h-4 w-4 text-purple-500" />} title="Skills found" tint="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex flex-wrap gap-2">
          {a.skills.map((s) => (
            <span key={s} className={`px-3 py-1 bg-white rounded-full text-sm border ${missing.has(s.toLowerCase()) ? 'text-rose-700 border-rose-200' : 'text-purple-700 border-purple-200'}`}>{s}</span>
          ))}
        </div>
      </Section>

      <div className="grid md:grid-cols-2 gap-4">
        <Section icon={<User className="h-4 w-4" />} title="Contact" tint="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center"><User className="h-3 w-3 mr-2 text-gray-500" />{a.name || 'Not found'}</div>
            <div className="flex items-center break-all"><Mail className="h-3 w-3 mr-2 text-gray-500 flex-shrink-0" />{a.email || 'Not found'}</div>
            <div className="flex items-center"><Phone className="h-3 w-3 mr-2 text-gray-500" />{a.phone || 'Not found'}</div>
            <div className="flex items-center"><MapPin className="h-3 w-3 mr-2 text-gray-500" />{a.location || 'Not found'}</div>
          </div>
        </Section>
        <Section icon={<GraduationCap className="h-4 w-4" />} title="Education and experience" tint="bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="space-y-1 text-sm text-gray-700">
            {a.education.map((e, i) => <p key={i}>{e}</p>)}
            <p className="flex items-center pt-2"><Briefcase className="h-3 w-3 mr-2 text-gray-500" />{a.experience_years} years of experience</p>
          </div>
        </Section>
      </div>

      {a.recommendation && (
        <Section icon={<Star className="h-4 w-4 text-purple-500" />} title="Recommendation" tint="bg-gradient-to-r from-indigo-50 to-purple-50">
          <p className="text-sm text-gray-700 leading-relaxed">{a.recommendation}</p>
        </Section>
      )}
    </div>
  );
}
