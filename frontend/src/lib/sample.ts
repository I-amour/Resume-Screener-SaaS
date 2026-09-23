import type { Analysis } from './types';

// Sample content for the 'Try it with a sample CV' button.
// The phone number has been removed because this file is public.

export const SAMPLE_FILENAME = 'Simi_Olusola_CV (sample).pdf';

export const SAMPLE_CV_TEXT = "Simi Olusola\nSoftware Engineer | simi.enquiries@gmail.com\n\nProfile\n2nd year Computer Science undergraduate at Loughborough University with expertise in full-stack development, data analytics, and digital\nmarketing. Proven ability to design high-impact web solutions and drive user engagement through data-driven strategies. Passionate about\nmentoring and promoting STEM opportunities for students.\n\nEducation\nLoughborough University\n\n2027\n\nBSc (Hons) | Computer Science\n•\n\nTop 9 Finalist — Software Undergraduate of the Year 2026 (Skyscanner & TargetJobs UK).\n\n•\n\nAwarded the Welsh Sparc Scholarship.\n\n•\n\nCoursework: Programming (Python, Java, C++), Algorithms, Web Development, Logic, and Software Engineering.\n\n•\n\nProjects: Arduino project, Full Stack Website development, Java Application\n\nSt David's Catholic College, Cardiff\n\n2024\n\nA Levels | General Studies\n•\n\nMathematics (A), Computer Science (A), Further Mathematics (B), Welsh Baccalaureate (A)\n\n•\n\nParticipated in debate clubs.\n\n•\n\nHeld tutoring sessions to help peers.\n\nEmployment Experience\nMyPocketSkill\n\n2023 - Present\n\nWeb Designer & Social Media Manager\n\n· Delivered 30+ custom websites (HTML/CSS/JS), improving satisfaction by 85%.\n· Ranked top 3 for 5 keywords through SEO; reduced bounce rate by 15%.\n· Increased engagement by 25% via Instagram/LinkedIn campaigns.\nVoluntary Experience\nSelf-Employed\n\n2023 - 2024\n\nMathematics Tutor\n\n· Tutored 10+ A-Level students, improving grades by 1-2 levels.\n· Designed and delivered customized lesson plans and hands-on coding workshops for A-Level students, focusing on problem-solving\ntechniques in Mathematics and practical Python programming.\nMyPocketSkill\n\n2023 - 2024\n\nSocial Media Ambassador\n\n· Promoted freelance jobs to 500+ students.\n· Blog article shared by 200+ users.\nSkills & Achievements\nCommunication: Demonstrated verbal communication by liaising with 62+ clients at MyPocketSkill to refine website designs, ensuring clarity in\nproject requirements.\nTechnical Proficiency: Full-Stack Development: Built dynamic websites (HTML/CSS/JS) and RESTful APIs (Java/Spring Boot), deployed via\nAWS. Data Analytics: Certified in Google Analytics; optimized SEO strategies to rank top 3 for 5 keywords.\nProblem Solving: Resolved 50+ legacy code issues for client websites, improving load times by 30% through debugging and algorithm\noptimization. Addressed A-Level students' challenges in Mathematics by creating tailored lesson plans, boosting grades by 1–2 levels.\n\nTime Management and Organisation: Balanced full-time studies, freelance web design, and tutoring while maintaining a first-class academic\naverage. Met tight deadlines for 30+ client projects at MyPocketSkill by prioritizing tasks using Agile methodologies.\nLeadership and Teamwork: Led 4+ university team projects in Computer Science modules by spearheading coding tasks (Python/Java),\nearning multiple Excellence Badges for outstanding collaboration and results.\n\nProjects\nTell — Phishing Email Examiner\n\n2026\n\nPersonal Project · JavaScript, HTML/CSS\n\n· Client-side tool that analyses emails against weighted phishing heuristics, returns an explainable risk score, and annotates each warning\nsign in the message. Runs entirely in the browser — no email data leaves the device.\nAI Resume Screener (SaaS)\n\n2025\n\nPersonal Project · React, TypeScript, FastAPI, OpenAI, PostgreSQL\n\n· Full-stack application that parses, scores and returns AI-generated feedback on uploaded CVs (PDF/DOC/DOCX), with real-time analysis\npowered by the OpenAI API and a PostgreSQL-backed service.\nVoice Journal\n\n2025\n\nPersonal Project · Flutter, Dart\n\n· Cross-platform (iOS/Android) journaling app with speech-to-text capture and AI sentiment analysis for mood tracking, built with a privacy-first\ndesign.\n\nAchievements and Interests\nSoftware Undergraduate of the Year — Top 9 Finalist\n\n2026\n\nSkyscanner & TargetJobs UK\nSelected as one of nine national finalists for the Software Undergraduate of the Year 2026 award, hosted by Skyscanner in partnership with\nTargetJobs UK, recognising top emerging software engineering talent across UK universities.\nUniversity Societies\nAs an active member of Loughborough's Ethnic Minorities Network (EMN) and African-Caribbean Society (ACS), I have contributed to\ndiscussions on diversity in tech and organized events bridging cultural and academic communities.\nWelsh Sparc Award\n\n2024\n\nUK SEF\nReceiving the Welsh Sparc Award bursary recognized my academic excellence and commitment to STEM outreach, which I further champion\nthrough mentoring aspiring coders.\nCoding\nOutside of my studies, I constantly iterate on new coding projects, from client-side security tools like Tell to AI-powered full-stack apps. These\nhobbies fuel my curiosity for turning ideas into functional solutions.\n[References available upon request]";

export const SAMPLE_JOB_DESCRIPTION = "Software Engineering Intern\n\nWe're looking for an intern to join our product engineering team. You'll build features across our React and TypeScript frontend and Python backend, working closely with senior engineers.\n\nWhat you'll do\n- Build and ship user-facing features in React and TypeScript\n- Write and maintain REST APIs in Python\n- Work with SQL databases and cloud services (AWS)\n- Write automated tests and take part in code reviews\n- Work in an Agile team with regular sprints\n\nWhat we're looking for\n- Studying Computer Science or a related subject\n- Experience with JavaScript/TypeScript and Python\n- Understanding of Git and version control\n- Desirable: CI/CD, Docker, cloud experience";

// Shown instantly to visitors without an API key, so the demo never depends on the server.
export const EXAMPLE_ANALYSIS: Analysis = {
  "name": "Simi Olusola",
  "email": "simi.enquiries@gmail.com",
  "phone": "",
  "location": "Loughborough, UK",
  "experience_years": 3,
  "overall_score": 71,
  "section_scores": {
    "impact": 66,
    "clarity": 72,
    "skills": 80,
    "ats_formatting": 62
  },
  "summary": "A second year Computer Science student with genuine client delivery experience and ambitious personal projects. The technical range is strong for this stage, but some achievements are stated as percentages without context, and the skills are written as paragraphs rather than a scannable list.",
  "skills": [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "TypeScript",
    "React",
    "FastAPI",
    "Spring Boot",
    "PostgreSQL",
    "AWS",
    "HTML",
    "CSS",
    "Flutter",
    "Dart",
    "OpenAI API",
    "SEO",
    "Google Analytics",
    "Agile"
  ],
  "education": [
    "BSc (Hons) Computer Science, Loughborough University (expected 2027)",
    "A Levels: Mathematics (A), Computer Science (A), Further Mathematics (B), St David's Catholic College, Cardiff"
  ],
  "strengths": [
    "Real client delivery: 30+ websites and 62+ clients through MyPocketSkill",
    "Personal projects show initiative and range, from a client-side phishing examiner to an AI-powered SaaS app",
    "National recognition as a Top 9 finalist for Software Undergraduate of the Year 2026",
    "Covers frontend, backend, mobile and AI integration"
  ],
  "weaknesses": [
    "Some metrics lack context, for example 'improving satisfaction by 85%' does not say how it was measured",
    "Technical skills are written as paragraphs, which is harder for recruiters and ATS systems to scan",
    "The profile is generic and does not say what kind of role you are aiming for",
    "The A Level heading says 'General Studies', which undersells your actual grades",
    "No mention of testing, version control or CI/CD"
  ],
  "bullet_rewrites": [
    {
      "original": "Delivered 30+ custom websites (HTML/CSS/JS), improving satisfaction by 85%.",
      "improved": "Designed and built 30+ responsive websites for small businesses in HTML, CSS and JavaScript, owning each project from client brief to launch and raising average client ratings to [X]/5."
    },
    {
      "original": "Resolved 50+ legacy code issues for client websites, improving load times by 30% through debugging and algorithm optimization.",
      "improved": "Debugged and refactored 50+ issues in legacy client codebases, cutting average page load time by 30% (from [X]s to [X]s)."
    },
    {
      "original": "Increased engagement by 25% via Instagram/LinkedIn campaigns.",
      "improved": "Planned and ran Instagram and LinkedIn campaigns for [X] clients, lifting average engagement by 25% over [X] months."
    }
  ],
  "job_match": {
    "score": 68,
    "matched_keywords": [
      "React",
      "TypeScript",
      "Python",
      "REST APIs",
      "SQL",
      "AWS",
      "Agile"
    ],
    "missing_keywords": [
      "Automated testing",
      "Git",
      "CI/CD",
      "Docker",
      "Code reviews"
    ],
    "tailoring_tips": [
      "Add a short 'Technical skills' list near the top so React, TypeScript and Python are visible in seconds",
      "Mention how you version and test your projects, for example Git, GitHub and any unit tests in the Resume Screener",
      "If you have used GitHub Actions or deployed with Docker, say so, as CI/CD is listed as desirable",
      "Lead your projects section with the AI Resume Screener, as it is closest to this role's stack"
    ]
  },
  "recommendation": "Strong candidate for junior and internship software roles. Tightening the metrics, adding a scannable skills list and showing testing and version control would move this CV from good to very competitive."
};
