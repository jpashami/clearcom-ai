import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import supabase from '../lib/supabase';

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!supabase) {
      setError('Authentication service is not available. Please try again later.');
      return;
    }

    if (password.length < 6) {
      setError(t('auth.signup.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (signUpError) throw signUpError;
      
      alert(t('auth.signup.checkEmail'));
      navigate('/login');
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
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.signup.title')}</h1>
          </div>
          <form onSubmit={handleSignUp} className="space-y-4">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength={6}
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
              <UserPlus className="w-4 h-4" />
              {loading ? t('auth.signup.creatingAccount') : t('common.createAccount')}
            </button>
          </form>
          <div className="mt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              {t('auth.signup.haveAccount')}
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
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