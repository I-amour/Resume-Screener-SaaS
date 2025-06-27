import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Download,
  Trash2
} from 'lucide-react';
import axios from 'axios';

interface Resume {
  id: string;
  filename: string;
  score: number;
  analysis: {
    name: string;
    email: string;
    phone: string;
    location: string;
    experience_years: number;
    skills: string[];
    education: string[];
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
  status: 'processing' | 'completed' | 'error';
  uploadedAt: string;
}

const API_BASE = 'https://resume-backend-eo9x.onrender.com';

function App() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await axios.post(`${API_BASE}/upload-resume`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const newResume: Resume = {
          id: response.data.id,
          filename: file.name,
          score: 0,
          analysis: {} as any,
          status: 'processing',
          uploadedAt: new Date().toISOString()
        };
        
        setResumes(prev => [...prev, newResume]);
        
        // Poll for results
        pollForResults(response.data.id);
        
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setIsUploading(false);
  }, []);

  const pollForResults = async (resumeId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = async () => {
      try {
        const response = await axios.get(`${API_BASE}/resume/${resumeId}`);
        
        if (response.data.status === 'completed') {
          setResumes(prev => prev.map(r => 
            r.id === resumeId 
              ? { ...r, ...response.data, status: 'completed' }
              : r
          ));
        } else if (response.data.status === 'error') {
          setResumes(prev => prev.map(r => 
            r.id === resumeId 
              ? { ...r, status: 'error' }
              : r
          ));
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Polling failed:', error);
      }
    };
    
    poll();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-teal-500';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-pink-500';
  };

  const deleteResume = (resumeId: string) => {
    setResumes(prev => prev.filter(r => r.id !== resumeId));
    if (selectedResume?.id === resumeId) {
      setSelectedResume(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ResumeAI
                </h1>
                <p className="text-sm text-gray-500">Intelligent Resume Screening</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {resumes.length} resumes analyzed
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-purple-500" />
                Upload Resumes
              </h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragActive 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-purple-200 hover:border-purple-300 hover:bg-purple-25'
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ scale: isDragActive ? 1.05 : 1 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {isDragActive ? 'Drop files here' : 'Drag & drop resumes'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOC, DOCX supported
                    </p>
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
                    Choose Files
                  </button>
                </motion.div>
              </div>

              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-purple-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Uploading...
                  </div>
                </div>
              )}
            </motion.div>

            {/* Resume List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Uploads</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {resumes.map((resume) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedResume?.id === resume.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                      onClick={() => setSelectedResume(resume)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex-shrink-0">
                            {resume.status === 'processing' && (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                            )}
                            {resume.status === 'completed' && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {resume.status === 'error' && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {resume.filename}
                            </p>
                            {resume.status === 'completed' && (
                              <div className="flex items-center mt-1">
                                <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getScoreColor(resume.score)} text-white font-medium`}>
                                  {resume.score}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResume(resume.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {selectedResume ? (
              <motion.div
                key={selectedResume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedResume.filename}
                  </h2>
                  {selectedResume.status === 'completed' && (
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(selectedResume.score)} text-white font-bold text-lg`}>
                      {selectedResume.score}%
                    </div>
                  )}
                </div>

                {selectedResume.status === 'processing' && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Analyzing resume with AI...</p>
                  </div>
                )}

                {selectedResume.status === 'error' && (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Error processing resume</p>
                  </div>
                )}

                {selectedResume.status === 'completed' && selectedResume.analysis && (
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Contact Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-2 text-gray-500" />
                            {selectedResume.analysis.name || 'Not provided'}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 text-gray-500" />
                            {selectedResume.analysis.email || 'Not provided'}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-2 text-gray-500" />
                            {selectedResume.analysis.phone || 'Not provided'}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2 text-gray-500" />
                            {selectedResume.analysis.location || 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Experience
                        </h3>
                        <div className="text-2xl font-bold text-green-600">
                          {selectedResume.analysis.experience_years} years
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.analysis.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Education
                      </h3>
                      <div className="space-y-1">
                        {selectedResume.analysis.education?.map((edu, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            {edu}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Strengths
                        </h3>
                        <ul className="space-y-1 text-sm">
                          {selectedResume.analysis.strengths?.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <Star className="h-3 w-3 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-1 text-sm">
                          {selectedResume.analysis.weaknesses?.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <div className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0 bg-red-300 rounded-full"></div>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        AI Recommendation
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedResume.analysis.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-12 text-center"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-12 w-12 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome to ResumeAI
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Upload resumes to get instant AI-powered analysis with scoring, 
                  strengths, weaknesses, and hiring recommendations.
                </p>
                <div className="text-sm text-gray-500">
                  Select a resume from the left panel to view detailed analysis
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
