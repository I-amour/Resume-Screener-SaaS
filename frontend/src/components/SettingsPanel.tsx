import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, KeyRound, Eye, EyeOff, Lock, Check, AlertTriangle } from 'lucide-react';
import { testKey } from '../lib/analyze';
import { DEFAULT_MODEL } from '../lib/storage';

interface Props {
  apiKey: string;
  model: string;
  remember: boolean;
  onSave: (key: string, model: string, remember: boolean) => void;
  onClose: () => void;
}

export default function SettingsPanel({ apiKey, model, remember, onSave, onClose }: Props) {
  const [key, setKey] = useState(apiKey);
  const [mdl, setMdl] = useState(model);
  const [rem, setRem] = useState(remember);
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    const err = await testKey(key.trim());
    setTestResult(err ? { ok: false, msg: err } : { ok: true, msg: 'Key works.' });
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/30 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="settings-title" className="text-lg font-semibold text-gray-800 flex items-center">
            <KeyRound className="h-5 w-5 mr-2 text-purple-500" /> Your OpenAI key
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" aria-label="Close settings">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          With your own key, your CV is read in your browser and sent straight to OpenAI. Nothing goes through our server.
          You can create a key at platform.openai.com.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="api-key">API key</label>
        <div className="flex gap-2 mb-2">
          <input
            id="api-key"
            type={show ? 'text' : 'password'}
            value={key}
            onChange={(e) => { setKey(e.target.value); setTestResult(null); }}
            placeholder="sk-..."
            autoComplete="off"
            spellCheck={false}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button onClick={() => setShow(!show)} className="px-3 border border-gray-300 rounded-lg hover:bg-gray-50" aria-label={show ? 'Hide key' : 'Show key'}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <button
          onClick={runTest}
          disabled={!key.trim() || testing}
          className="text-sm text-purple-600 font-medium disabled:text-gray-400 mb-2"
        >
          {testing ? 'Checking…' : 'Check key'}
        </button>
        {testResult && (
          <p className={`text-sm mb-2 flex items-center ${testResult.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
            {testResult.ok ? <Check className="h-4 w-4 mr-1" /> : <AlertTriangle className="h-4 w-4 mr-1" />}
            {testResult.msg}
          </p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1 mt-3" htmlFor="model">Model</label>
        <input
          id="model"
          value={mdl}
          onChange={(e) => setMdl(e.target.value)}
          placeholder={DEFAULT_MODEL}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <label className="flex items-start gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
          <input type="checkbox" checked={rem} onChange={(e) => setRem(e.target.checked)} className="mt-1 accent-purple-600" />
          <span>Remember this key on this device</span>
        </label>
        <p className="text-xs text-gray-500 mb-5 flex items-start">
          <Lock className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          Only tick this on your own device. Otherwise the key is forgotten when you close the tab.
        </p>

        <div className="flex gap-2">
          {apiKey && (
            <button
              onClick={() => onSave('', mdl.trim() || DEFAULT_MODEL, false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              Remove key
            </button>
          )}
          <button
            onClick={() => onSave(key.trim(), mdl.trim() || DEFAULT_MODEL, rem)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
