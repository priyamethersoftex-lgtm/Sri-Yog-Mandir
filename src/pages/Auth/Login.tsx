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
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-shrink-0"
        aria-hidden="true"
      >
        {/* Property image — object-position tuned to show building facade */}
        <img
          src={mainImage}
          alt="Sri Yoga Mandir property"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />

        {/* Layered gradient overlay: stronger at top for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,5,18,0.88) 0%, rgba(10,5,18,0.60) 25%, rgba(10,5,18,0.25) 60%, rgba(10,5,18,0.15) 100%)',
          }}
        />

        {/* Brand block — top-left, generous padding */}
        <div className="relative z-10 flex flex-col justify-start w-full h-full p-10 xl:p-14 pt-14 xl:pt-16">
          {/* Logo + name row */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-[72px] h-[72px] xl:w-[80px] xl:h-[80px] rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <img
                src={yogaMandirLogo}
                alt="Sri Yoga Mandir Logo"
                className="w-full h-full object-contain p-2 drop-shadow-lg"
              />
            </div>
            <div>
              <p
                className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1"
                style={{ color: 'rgba(245,130,32,0.85)' }}
              >
                Official Portal
              </p>
              <h1
                className="text-[26px] xl:text-[30px] font-bold leading-tight text-white tracking-tight"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                Sri Yoga Mandir
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mb-5 w-12 h-[2px] rounded-full"
            style={{ background: 'rgba(245,130,32,0.70)' }}
          />

          {/* Sub-label */}
          <p
            className="text-[13px] font-semibold tracking-[0.12em] uppercase mb-2"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Property Management System
          </p>

          {/* Tagline */}
          <p
            className="text-[18px] xl:text-[20px] font-light leading-relaxed max-w-sm"
            style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
          >
            Your peaceful retreat
            <br />by the Ganges.
          </p>

          {/* Bottom attribution badge (Keep it at the bottom using mt-auto) */}
          <div className="mt-auto flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: 'rgba(245,130,32,0.75)' }}
            />
            <span
              className="text-[11px] font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.40)' }}
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
        {/* Thin top accent stripe */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        />

        {/* Main scrollable content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[400px]">

            {/* ── Mobile-only brand header ── */}
            <div className="lg:hidden flex flex-col items-center text-center mb-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(245,130,32,0.08)',
                  border: '1px solid rgba(245,130,32,0.20)',
                }}
              >
                <img
                  src={yogaMandirLogo}
                  alt="Sri Yoga Mandir Logo"
                  className="w-11 h-11 object-contain"
                />
              </div>
              <h1
                className="text-[22px] font-bold tracking-tight"
                style={{ color: 'var(--color-text)' }}
              >
                Sri Yoga Mandir
              </h1>
              <p
                className="text-[11px] font-semibold tracking-[0.14em] uppercase mt-1"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Property Management System
              </p>
            </div>

            {/* ── Heading ── */}
            <div className="mb-8">
              <h2
                className="text-[28px] font-bold tracking-tight leading-tight"
                style={{ color: 'var(--color-text)' }}
              >
                Welcome back
              </h2>
              <p
                className="text-[15px] mt-2 font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Sign in to manage your property.
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleLogin} noValidate>
              <div className="space-y-5">
                <FormField
                  id="login-email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                  placeholder="you@example.com"
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

              <div className="mt-7">
                <Button
                  id="login-submit"
                  type="submit"
                  className="w-full text-[15px] font-bold"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    letterSpacing: '0.02em',
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
        <div
          className="flex-shrink-0 text-center px-6 py-5"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p
            className="text-[12px] font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            © {new Date().getFullYear()} Sri Yoga Mandir &nbsp;·&nbsp; Property Management System
          </p>
        </div>
      </div>
    </div>
  );
}
