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
    <div className="min-h-screen flex w-full overflow-hidden" style={{ background: 'var(--color-background)' }}>

      {/* ═══════════════════════════════════
          LEFT PANEL — Property Image & Brand
          ═══════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-shrink-0"
        aria-hidden="true"
      >
        {/* Property image — brightened and positioned */}
        <img
          src={mainImage}
          alt="Sri Yoga Mandir property"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            objectPosition: 'center 30%',
            filter: 'brightness(1.15)' 
          }}
        />

        {/* Subtle, elegant gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,5,18,0.20) 0%, rgba(10,5,18,0.45) 50%, rgba(10,5,18,0.85) 100%)',
          }}
        />

        {/* Brand block — grouped vertically, balanced padding */}
        <div className="relative z-10 flex flex-col w-full h-full p-12 xl:p-16">
          
          <div className="mt-8 xl:mt-12 flex flex-col items-start">
            {/* Logo */}
            <div
              className="w-[76px] h-[76px] rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src={yogaMandirLogo}
                alt="Sri Yoga Mandir Logo"
                className="w-full h-full object-contain p-2 drop-shadow-md"
              />
            </div>

            {/* Typography Group */}
            <p
              className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1.5"
              style={{ color: 'var(--color-primary)' }}
            >
              Official Portal
            </p>
            
            <h1
              className="text-[32px] xl:text-[36px] font-bold leading-tight text-white tracking-tight mb-4"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
            >
              Sri Yoga Mandir
            </h1>

            {/* Divider */}
            <div
              className="w-12 h-[3px] rounded-full mb-4"
              style={{ background: 'var(--color-primary)' }}
            />

            <p
              className="text-[13px] font-semibold tracking-[0.14em] uppercase mb-2"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Property Management System
            </p>

            <p
              className="text-[18px] xl:text-[20px] font-medium leading-relaxed mt-2 max-w-md"
              style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
            >
              Your peaceful retreat by the Ganges.
            </p>
          </div>

          {/* Bottom location badge */}
          <div className="mt-auto flex items-center gap-2.5 opacity-80">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: 'var(--color-primary)' }}
            />
            <span
              className="text-[12px] font-medium tracking-wide text-white"
            >
              Varanasi, Uttar Pradesh, India
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          RIGHT PANEL — Login Form
          ═══════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col min-h-screen overflow-y-auto"
        style={{ background: 'var(--color-surface)' }}
      >
        {/* Subtle top accent stripe */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        />

        {/* Main scrollable content — perfectly centered form */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-12">
          <div className="w-full max-w-[380px]">

            {/* ── Mobile-only brand header ── */}
            <div className="lg:hidden flex flex-col items-center text-center mb-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(245,130,32,0.05)',
                  border: '1px solid rgba(245,130,32,0.15)',
                }}
              >
                <img
                  src={yogaMandirLogo}
                  alt="Sri Yoga Mandir Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h1
                className="text-[24px] font-bold tracking-tight"
                style={{ color: 'var(--color-text)' }}
              >
                Sri Yoga Mandir
              </h1>
              <p
                className="text-[11px] font-bold tracking-[0.15em] uppercase mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Property Management System
              </p>
            </div>

            {/* ── Heading ── */}
            <div className="mb-[36px]">
              <h2
                className="text-[30px] font-bold tracking-tight leading-tight"
                style={{ color: 'var(--color-text)' }}
              >
                Welcome back
              </h2>
              <p
                className="text-[15px] mt-2 font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Sign in to manage your property.
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleLogin} noValidate>
              <div className="space-y-[22px]">
                <FormField
                  id="login-email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />

                <FormField
                  id="login-password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="mt-[28px]">
                <Button
                  id="login-submit"
                  type="submit"
                  className="w-full text-[15px] font-bold transition-colors duration-200"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    letterSpacing: '0.01em',
                    boxShadow: '0 2px 8px rgba(245,130,32,0.15)',
                  }}
                  isLoading={isLoggingIn}
                  disabled={isLoggingIn}
                  aria-label="Sign in to Sri Yoga Mandir portal"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 text-center px-6 pb-[24px]">
          <p
            className="text-[12px] font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Sri Yoga Mandir &nbsp;•&nbsp; Property Management System
          </p>
        </div>
      </div>
    </div>
  );
}
