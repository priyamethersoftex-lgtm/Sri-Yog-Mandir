import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { toast } from 'sonner';
import yogaMandirLogo from '../../assets/yogaMandirImage.png';
import mainImage from '../../assets/YogamammadirMainImage.webp';

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
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-brand-900 overflow-hidden">
        <img 
          src={mainImage} 
          alt="Sri Yoga Mandir" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-brand-900/20 mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-20 w-full pb-24">
          <div className="mb-8 w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md p-3 flex items-center justify-center border border-white/20 shadow-2xl">
            <img src={yogaMandirLogo} alt="Banaras Yog Mandir Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Sri Yoga Mandir
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 font-medium drop-shadow-sm max-w-lg leading-snug">
            Your Peaceful Retreat by the Ganges.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-surface">
        {/* Ambient Glow background elements for right side */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="mb-10 lg:hidden flex flex-col items-center">
             <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lotus border border-brand-500/20 mb-4">
              <img src={yogaMandirLogo} alt="Banaras Yog Mandir Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-coral-500 to-plum-600 bg-clip-text text-transparent">
              Sri Yoga Mandir
            </h1>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h2>
            <p className="text-text-secondary font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
            
            <div className="pt-2">
              <Button type="submit" className="w-full text-base py-3.5 shadow-lotus font-bold rounded-xl transition-all hover:-translate-y-0.5" isLoading={isLoggingIn}>
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="mt-12 text-center border-t border-divider pt-6">
            <p className="text-sm text-text-muted">
              Property Management System Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
