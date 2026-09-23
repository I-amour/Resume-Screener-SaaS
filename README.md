
# 🚀 AI-Powered Resume Screener SaaS

A modern, AI-powered resume screening application built with React, FastAPI, and OpenAI. This SaaS solution provides intelligent resume analysis with scoring, detailed feedback, and hiring recommendations.

### Check it out here: https://i-amour.github.io/Resume-Screener-SaaS/

---

## 🔑 Bring your own OpenAI key

Add your own OpenAI API key in the app (top right) and everything runs in your browser: your CV is read on your device and sent straight to OpenAI. It never touches my server, and you get instant results plus job description matching. You can choose whether the key is remembered on your device.

No key? The app falls back to a free demo server on Render, which can take up to a minute to wake up.

## ✨ Features

- 🎯 **Job description matching:** paste a job ad to get a match score, the keywords you already cover, the ones you're missing, and tailoring tips
- 📊 **Detailed scoring:** overall score plus impact, clarity, skills and ATS formatting scores
- ✍️ **Bullet point rewrites:** your three weakest bullet points rewritten with stronger action verbs (with [X] placeholders so nothing is made up)
- 🔒 **Private by design:** PDF and DOCX files are parsed in the browser with pdf.js and mammoth
- 🕘 **History:** past reports stay after a refresh, stored only on your device
- ⬇️ **Export:** download or copy any report as Markdown
- 📱 **Responsive** across desktop, tablet and mobile

## 🛠️ Tech Stack

### Frontend

* React 18 with TypeScript
* Vite for fast development and build
* Tailwind CSS for styling
* Framer Motion for smooth animations
* React Dropzone for file uploads
* pdf.js and mammoth for in-browser PDF and DOCX parsing
* Lucide React for icons
* Axios for API communication

### Backend

* FastAPI for high-performance REST API
* SQLAlchemy for database ORM
* PostgreSQL for data storage
* OpenAI API for AI-powered resume analysis
* PyPDF2 for PDF text extraction
* Pydantic for data validation and schema enforcement

---


## Deploying

```bash
cd frontend
npm install
npm run deploy   # builds and publishes to GitHub Pages
```

## **Upcoming TODO features:**

* Require users to provide their own OpenAI API key to use the service
* Implement payment/subscription plans to enable paid usage and manage costs
* Improve error handling and UI/UX for better user experience
* Add more resume formats and enhanced scoring algorithms

---

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies for frontend and backend
3. Provide your own OpenAI API key in the backend environment variables (`OPENAI_API_KEY`)
4. Run the backend FastAPI server and the frontend React app
5. Open the app in your browser and upload resumes to test AI analysis

---

## 📫 Contact

Feel free to open issues or pull requests to contribute. For questions, reach out at \[[simi.enquiries@gmail.com](mailto:simi.enquiries@gmail.com)].

---

**Thank you for checking out this project!**
If you'd like to support the development, star the repo and share your feedback.
