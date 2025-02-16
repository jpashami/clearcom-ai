import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles, Mail } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('access_requests')
        .insert([{ email }]);

      if (dbError) throw dbError;

      setRequestSent(true);
      setEmail('');
    } catch (err) {
      setError('Failed to submit request. Please try again later.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <div className="flex items-center gap-4 mb-8">
              <img src="https://mdlronumfhiwqbsozcjg.supabase.co/storage/v1/object/sign/Images/ClearComlog.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvQ2xlYXJDb21sb2cucG5nIiwiaWF0IjoxNzM5NjQ2ODkyLCJleHAiOjE4MjYwNDY4OTJ9.rn9_yaPd5q2UhpFoR2blJhr6sqcTt_pNjQHMyKZ3HJw" alt="ClearCom AI Logo" className="w-16 h-16" />
              <h1 className="text-4xl font-bold text-gray-900">ClearCom AI Agent</h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Transform Your Writing with AI-Powered Intelligence
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Enhance your text and craft perfect email responses with our advanced AI assistant.
              Experience the future of professional communication.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="lg:w-1/2 space-y-8">
            <div className="bg-white rounded-xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Text Enhancement
              </h3>
              <p className="text-gray-600">
                Polish your writing with AI-powered suggestions that improve clarity,
                grammar, and style while maintaining your unique voice.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Smart Email Responses
              </h3>
              <p className="text-gray-600">
                Generate professional email responses in seconds. Perfect for business
                communication and customer service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Access Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Request Early Access
            </h2>
            <form onSubmit={handleAccessRequest} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
              {requestSent ? (
                <div className="text-green-600 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Request sent! We'll be in touch soon.
                </div>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Request Access
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}