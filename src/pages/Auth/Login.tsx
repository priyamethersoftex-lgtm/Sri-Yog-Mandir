import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { toast } from 'sonner';
import yogaMandirLogo from '../../assets/yogaMandirImage.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Lotus Ambient Glow background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface/90 backdrop-blur-xl p-8 rounded-3xl shadow-lotus border border-brand-500/20 relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lotus border border-brand-500/20 mb-4 transform hover:scale-105 transition-transform duration-300">
            <img src={yogaMandirLogo} alt="Banaras Yog Mandir Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-coral-500 to-plum-600 bg-clip-text text-transparent mb-1">
            Sri Yoga Mandir
          </h1>
          <p className="text-text-secondary text-sm font-medium">Property Management System Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <FormField 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required 
          />
          <FormField 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required 
          />
          
          <div className="pt-4">
            <Button type="submit" className="w-full text-base py-3 shadow-lotus" isLoading={isLoggingIn}>
              Sign In to Portal
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
