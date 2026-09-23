import type { ResumeResult } from './types';

const bullets = (items: string[] = []) => items.map((i) => `- ${i}`).join('\n');

export function toMarkdown(r: ResumeResult): string {
  const a = r.analysis;
  if (!a) return '';
  const s = a.section_scores;
  return [
    `# CV report: ${r.filename}`,
    `Overall score: **${a.overall_score}/100**`,
    s ? `Impact ${s.impact} · Clarity ${s.clarity} · Skills ${s.skills} · ATS formatting ${s.ats_formatting}` : '',
    a.summary ? `\n## Summary\n${a.summary}` : '',
    a.job_match
      ? `\n## Job match: ${a.job_match.score}/100\n**Matched:** ${a.job_match.matched_keywords.join(', ') || 'none'}\n\n**Missing:** ${a.job_match.missing_keywords.join(', ') || 'none'}\n\n**Tailoring tips**\n${bullets(a.job_match.tailoring_tips)}`
      : '',
    `\n## Strengths\n${bullets(a.strengths)}`,
    `\n## To improve\n${bullets(a.weaknesses)}`,
    a.bullet_rewrites?.length
      ? `\n## Suggested rewrites\n${a.bullet_rewrites.map((b) => `- Before: ${b.original}\n  After: ${b.improved}`).join('\n')}`
      : '',
    `\n## Skills\n${a.skills.join(', ')}`,
    `\n## Recommendation\n${a.recommendation}`,
  ].filter(Boolean).join('\n');
}

export function downloadMarkdown(r: ResumeResult) {
  const blob = new Blob([toMarkdown(r)], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = r.filename.replace(/\.[^.]+$/, '') + '-report.md';
  a.click();
  URL.revokeObjectURL(url);
}
