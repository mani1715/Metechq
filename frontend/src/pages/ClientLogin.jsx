import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Lock, Mail, LogIn, Briefcase } from 'lucide-react';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/client/auth/login', formData);
      
      // Store token and client data
      localStorage.setItem('client_token', response.data.access_token);
      localStorage.setItem('client_data', JSON.stringify(response.data.client));
      
      toast.success('🎉 Welcome back! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 border-purple-100" data-testid="client-login-card">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform p-2">
            <img 
              src="/favicon.svg" 
              alt="METECHQ Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Client Portal
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to view your projects and track progress in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="client-login-form">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-11 h-11 border-2 focus:border-purple-500 transition-colors"
                  data-testid="client-login-email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-11 h-11 border-2 focus:border-purple-500 transition-colors"
                  data-testid="client-login-password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              disabled={loading}
              data-testid="client-login-submit-btn"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In to Dashboard
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-medium mb-1">Need Help?</p>
              <p className="text-xs text-gray-600">Contact your project manager for login credentials or assistance.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
