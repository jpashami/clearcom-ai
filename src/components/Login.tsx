import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, Home, ArrowLeft } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import supabase from '../lib/supabase';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
      setError('Authentication service is not available. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
      setError('Authentication service is not available. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://clearcom.netlify.app/reset-password',
      });

      if (resetError) throw resetError;

      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-end p-4">
        <LanguageSelector />
      </div>
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <img src="https://mdlronumfhiwqbsozcjg.supabase.co/storage/v1/object/sign/Images/ClearComlog.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvQ2xlYXJDb21sb2cucG5nIiwiaWF0IjoxNzM5NjQ2ODkyLCJleHAiOjE4MjYwNDY4OTJ9.rn9_yaPd5q2UhpFoR2blJhr6sqcTt_pNjQHMyKZ3HJw" alt="ClearCom AI Logo" className="w-16 h-16" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isResetMode ? t('auth.resetPassword.title') : t('auth.login.title')}
            </h1>
          </div>

          {isResetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              {resetSent && (
                <div className="text-green-600 text-sm p-3 bg-green-50 rounded-lg border border-green-100">
                  {t('auth.resetPassword.success')}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? t('auth.resetPassword.sending') : t('auth.resetPassword.send')}
              </button>
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.resetPassword.backToLogin')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('common.password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {t('common.forgotPassword')}
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? t('auth.login.signingIn') : t('common.signIn')}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
            >
              <Home className="w-4 h-4" />
              {t('common.backToHome')}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {t('common.copyright')}
            </div>
            <div className="text-sm text-gray-600">
              {t('common.support')}{' '}
              <a href="mailto:jafar@novalycs.com" className="text-indigo-600 hover:text-indigo-800">
                jafar@novalycs.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}