import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Sparkles, CheckCircle, XCircle, Trash2, Settings, KeyRound, Server, Target, Play,
} from 'lucide-react';
import axios from 'axios';
import type { ResumeResult } from './lib/types';
import { storage } from './lib/storage';
import { analyzeWithOwnKey, analyzeWithServer, API_BASE } from './lib/analyze';
import { SAMPLE_CV_TEXT, SAMPLE_FILENAME, SAMPLE_JOB_DESCRIPTION, EXAMPLE_ANALYSIS } from './lib/sample';
import SettingsPanel from './components/SettingsPanel';
import ReportView from './components/ReportView';

const newId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : String(Date.now() + Math.random());

function App() {
  const [results, setResults] = useState<ResumeResult[]>(() =>
    // Anything left "processing" from a previous visit can't finish, so mark it failed.
    storage.getHistory<ResumeResult>().map((r) =>
      r.status === 'processing' ? { ...r, status: 'error', error: 'Interrupted. Upload it again.' } : r,
    ),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => storage.getKey());
  const [rememberKey, setRememberKey] = useState(() => !!storage.getKey());
  const [model, setModel] = useState(() => storage.getModel());
  const [jobDescription, setJobDescription] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const usingOwnKey = apiKey.length > 0;
  const selected = results.find((r) => r.id === selectedId) ?? null;

  useEffect(() => { storage.setHistory(results); }, [results]);

  // On phones the report sits below the history, so bring it into view.
  useEffect(() => {
    if (selectedId && window.innerWidth < 1024) {
      reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedId]);

  // Without a key we rely on the free Render server, so wake it early.
  useEffect(() => {
    if (!usingOwnKey) axios.get(`${API_BASE}/`, { timeout: 90000 }).catch(() => {});
  }, [usingOwnKey]);

  const update = (id: string, patch: Partial<ResumeResult>) =>
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const onDrop = useCallback(
    async (files: File[]) => {
      const jd = jobDescription;
      const jobs = files.map((file) => ({
        file,
        entry: {
          id: newId(),
          filename: file.name,
          status: 'processing' as const,
          uploadedAt: new Date().toISOString(),
          source: usingOwnKey ? ('own-key' as const) : ('demo-server' as const),
          withJobDescription: usingOwnKey && jd.trim().length > 0,
        },
      }));
      setResults((prev) => [...jobs.map((j) => j.entry), ...prev]);
      if (jobs[0]) setSelectedId(jobs[0].entry.id);

      await Promise.all(
        jobs.map(async ({ file, entry }) => {
          try {
            const analysis = usingOwnKey
              ? await analyzeWithOwnKey(await (await import('./lib/extractText')).extractText(file), jd, apiKey, model)
              : await analyzeWithServer(file);
            update(entry.id, { status: 'completed', analysis });
          } catch (e) {
            update(entry.id, { status: 'error', error: e instanceof Error ? e.message : 'Something went wrong.' });
          }
        }),
      );
    },
    [usingOwnKey, apiKey, model, jobDescription],
  );

  // Lets visitors test drive the app with Simi's CV.
  const trySample = async () => {
    const id = newId();
    if (!usingOwnKey) {
      // No key: show a saved example instantly rather than waiting on the demo server.
      setResults((prev) => [{
        id, filename: SAMPLE_FILENAME, status: 'completed', uploadedAt: new Date().toISOString(),
        source: 'example', withJobDescription: true, analysis: EXAMPLE_ANALYSIS,
      }, ...prev]);
      setSelectedId(id);
      return;
    }
    const jd = jobDescription.trim() ? jobDescription : SAMPLE_JOB_DESCRIPTION;
    if (!jobDescription.trim()) setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setResults((prev) => [{
      id, filename: SAMPLE_FILENAME, status: 'processing', uploadedAt: new Date().toISOString(),
      source: 'own-key', withJobDescription: true,
    }, ...prev]);
    setSelectedId(id);
    try {
      update(id, { status: 'completed', analysis: await analyzeWithOwnKey(SAMPLE_CV_TEXT, jd, apiKey, model) });
    } catch (e) {
      update(id, { status: 'error', error: e instanceof Error ? e.message : 'Something went wrong.' });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const saveSettings = (key: string, mdl: string, remember: boolean) => {
    setApiKey(key);
    setModel(mdl);
    setRememberKey(remember);
    storage.setModel(mdl);
    storage.setKey(remember && key ? key : null);
    setShowSettings(false);
  };

  const remove = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const scoreChip = (s: number) =>
    s >= 80 ? 'from-emerald-400 to-teal-500' : s >= 60 ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-pink-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ResumeAI</h1>
              <p className="text-sm text-gray-500">Score your CV and match it to a job</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className={`inline-flex items-center text-sm px-3 py-2 rounded-lg border ${usingOwnKey ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-purple-200 text-purple-700 hover:bg-purple-50'}`}
          >
            {usingOwnKey ? <KeyRound className="h-4 w-4 mr-1.5" /> : <Settings className="h-4 w-4 mr-1.5" />}
            {usingOwnKey ? 'Using your key' : 'Add API key'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {!usingOwnKey && (
              <div className="bg-white/80 rounded-2xl border border-purple-100 p-4 text-sm text-gray-600 flex items-start">
                <Server className="h-4 w-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                <p>
                  You’re using the free demo server, which can be slow to start.{' '}
                  <button onClick={() => setShowSettings(true)} className="text-purple-600 font-medium underline">Add your own OpenAI key</button>{' '}
                  for instant results and job matching.
                </p>
              </div>
            )}

            <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6">
              <label htmlFor="jd" className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-500" /> Job description <span className="ml-1 font-normal text-gray-400 text-sm">(optional)</span>
              </label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={!usingOwnKey}
                rows={5}
                placeholder={usingOwnKey ? 'Paste a job ad to see how well your CV matches it' : 'Job matching needs your own API key'}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-50 disabled:text-gray-400"
              />

              <div
                {...getRootProps()}
                className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">{isDragActive ? 'Drop your CV here' : 'Drop a CV or click to choose'}</p>
                <p className="text-sm text-gray-500 mt-1">PDF or .docx</p>
              </div>

              <button
                onClick={trySample}
                className="mt-3 w-full inline-flex items-center justify-center text-sm px-4 py-2.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Play className="h-4 w-4 mr-2" /> Try it with a sample CV
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {usingOwnKey ? 'Runs a live analysis on my own CV against a sample internship ad.' : 'Shows an example report for my own CV. Add a key to run it live.'}
              </p>
            </section>

            <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">History</h3>
                {results.length > 0 && (
                  <button onClick={() => { setResults([]); setSelectedId(null); }} className="text-xs text-gray-500 hover:text-rose-600">Clear all</button>
                )}
              </div>
              {results.length === 0 ? (
                <p className="text-sm text-gray-500">Your analysed CVs will appear here and stay after you refresh.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {results.map((r) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(r.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedId === r.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {r.status === 'processing' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 flex-shrink-0" />}
                            {r.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                            {r.status === 'error' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{r.filename}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(r.uploadedAt).toLocaleDateString()}{r.withJobDescription ? ', matched to a job' : ''}
                              </p>
                            </div>
                            {r.status === 'completed' && r.analysis && (
                              <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${scoreChip(r.analysis.overall_score)} text-white font-medium`}>
                                {r.analysis.overall_score}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); remove(r.id); }}
                            className="p-1 ml-2 hover:bg-red-100 rounded text-red-500"
                            aria-label={`Delete ${r.filename}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-2 scroll-mt-24" ref={reportRef}>
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2 break-words">{selected.filename}</h2>
                {selected.source === 'example' ? (
                  <p className="text-sm text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 mb-6">
                    This is a saved example report.{' '}
                    <button onClick={() => setShowSettings(true)} className="underline font-medium">Add your OpenAI key</button>{' '}
                    to analyse your own CV live.
                  </p>
                ) : <div className="mb-4" />}

                {selected.status === 'processing' && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">
                      {selected.source === 'own-key' ? 'Reading your CV and analysing it…' : 'Sending to the demo server… this can take up to a minute.'}
                    </p>
                  </div>
                )}

                {selected.status === 'error' && (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-700 mb-1">This CV couldn’t be analysed</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">{selected.error}</p>
                  </div>
                )}

                {selected.status === 'completed' && selected.analysis && <ReportView result={selected} />}
              </motion.div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-12 text-center">
                <FileText className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload a CV to get started</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You’ll get an overall score, section scores, rewrites for your weakest bullet points and, if you add a job description, a match score with the keywords you’re missing.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showSettings && (
        <SettingsPanel
          apiKey={apiKey}
          model={model}
          remember={rememberKey}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
