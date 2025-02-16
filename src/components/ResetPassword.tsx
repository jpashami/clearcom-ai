import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      if (!supabase) {
        setError('Authentication service is not available. Please try again later.');
        return;
      }

      try {
        // Get the access token from the URL hash
        const hash = location.hash;
        if (!hash) {
          throw new Error('No access token found');
        }

        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }

        // Set the session using the access token
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          throw sessionError;
        }
      } catch (err) {
        console.error('Error setting up password recovery:', err);
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    handlePasswordRecovery();
  }, [location.hash, navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
      setError('Authentication service is not available. Please try again later.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (resetError) throw resetError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <img src="https://mdlronumfhiwqbsozcjg.supabase.co/storage/v1/object/sign/Images/ClearComlog.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvQ2xlYXJDb21sb2cucG5nIiwiaWF0IjoxNzM5NjQ2ODkyLCJleHAiOjE4MjYwNDY4OTJ9.rn9_yaPd5q2UhpFoR2blJhr6sqcTt_pNjQHMyKZ3HJw" alt="ClearCom AI Logo" className="w-16 h-16" />
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          
          {success && (
            <div className="text-green-600 text-sm p-3 bg-green-50 rounded-lg border border-green-100">
              Password successfully reset! Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring -offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}