import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { Sparkles, Loader2, Mail, MessageSquare, Copy, Check, LogOut, Home, Trash2 } from 'lucide-react';

type ToneType = 'formal' | 'semi-formal' | 'informal';
type TabType = 'enhance' | 'email';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('enhance');
  const [inputText, setInputText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [draftPoints, setDraftPoints] = useState('');
  const [responsePoints, setResponsePoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState<ToneType>('formal');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
        return;
      }
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
        return;
      }
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const clearFields = () => {
    if (activeTab === 'enhance') {
      setInputText('');
      setEnhancedText('');
    } else {
      setEmailContent('');
      setDraftPoints('');
      setResponsePoints('');
    }
    setError('');
  };

  const enhanceText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to enhance');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional editor. Enhance the following text to improve its grammar and fluency while maintaining its original meaning. Use a ${tone} tone in the enhanced text.`
          },
          {
            role: "user",
            content: inputText
          }
        ],
        model: "gpt-3.5-turbo",
      });

      setEnhancedText(completion.choices[0].message.content || '');
    } catch (err) {
      setError('Failed to enhance text. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmailResponse = async () => {
    if (!emailContent.trim()) {
      setError('Please enter the email content to respond to');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional email assistant. Generate a response based on the draft points provided.
            Use a ${tone} tone and maintain proper email formatting.`
          },
          {
            role: "user",
            content: `Original Email: ${emailContent}\n\nDraft Points: ${draftPoints}`
          }
        ],
        model: "gpt-3.5-turbo",
      });

      setResponsePoints(completion.choices[0].message.content || '');
    } catch (err) {
      setError('Failed to generate response. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img src="https://mdlronumfhiwqbsozcjg.supabase.co/storage/v1/object/sign/Images/ClearComlog.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvQ2xlYXJDb21sb2cucG5nIiwiaWF0IjoxNzM5NjQ2ODkyLCJleHAiOjE4MjYwNDY4OTJ9.rn9_yaPd5q2UhpFoR2blJhr6sqcTt_pNjQHMyKZ3HJw" alt="ClearCom AI Logo" className="w-12 h-12" />
              <h1 className="text-3xl font-bold text-gray-900">ClearCom AI Agent</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('enhance')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
                activeTab === 'enhance'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Text Enhancement
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Response
            </button>
            <button
              onClick={clearFields}
              className="flex items-center gap-2 px-6 py-3 font-medium text-sm text-gray-500 hover:text-gray-700 ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Tone
              </label>
              <div className="flex gap-6">
                {(['formal', 'semi-formal', 'informal'] as const).map((toneOption) => (
                  <label key={toneOption} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value={toneOption}
                      checked={tone === toneOption}
                      onChange={(e) => setTone(e.target.value as ToneType)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {toneOption}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {activeTab === 'enhance' ? (
              <>
                <div>
                  <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Text
                  </label>
                  <textarea
                    id="input"
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text here to enhance its grammar and fluency..."
                  />
                </div>

                <button
                  onClick={enhanceText}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enhance Text
                    </>
                  )}
                </button>

                {enhancedText && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Enhanced Text
                      </label>
                      <button
                        onClick={() => copyToClipboard(enhancedText)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="w-full min-h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap">
                      {enhancedText}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Original Email
                    </label>
                    <textarea
                      id="email"
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Paste the email you want to respond to..."
                    />
                  </div>
                  <div>
                    <label htmlFor="draft" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Draft Points/Ideas
                    </label>
                    <textarea
                      id="draft"
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={draftPoints}
                      onChange={(e) => setDraftPoints(e.target.value)}
                      placeholder="Enter your draft points or ideas for the response..."
                    />
                  </div>
                </div>

                <button
                  onClick={generateEmailResponse}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Response...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Generate Response
                    </>
                  )}
                </button>

                {responsePoints && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Response
                      </label>
                      <button
                        onClick={() => copyToClipboard(responsePoints)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="w-full min-h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap">
                      {responsePoints}
                    </div>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}