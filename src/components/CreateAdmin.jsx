import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { createAdminAccount } from '../firebase/authService.js';

export const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters long.');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      const result = await createAdminAccount(email, password);
      
      if (result.success) {
        setMessage('✅ Admin account created successfully! You can now sign in.');
        setMessageType('success');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(`❌ ${result.error}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Create admin error:', error);
      setMessage('❌ Failed to create admin account. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Admin Account - Faahad Bhat</title>
      </Helmet>
      <div className="min-h-screen bg-[#0e141b] text-white font-inter flex items-center justify-center p-5">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Back to Portfolio
            </Link>
            <h1 className="text-2xl font-bold mt-4">Create Admin Account</h1>
            <p className="text-gray-400 mt-2">Set up your first admin account</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-900/20 border border-green-500/30 text-green-300' 
                : 'bg-red-900/20 border border-red-500/30 text-red-300'
            }`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/blog/admin" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Already have an account? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}; 