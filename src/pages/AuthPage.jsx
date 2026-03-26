import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../context/AuthContext';

const loginDefaults = { email: '', password: '' };
const signupDefaults = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

const copyContent = {
  signIn: {
    eyebrow: 'Welcome Back',
    title: 'Sign in',
  },
  signUp: {
    eyebrow: 'Join With Us',
    title: 'Create account',
  },
};

function AuthIcon({ type }) {
  if (type === 'mail') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16v12H4z" />
        <path d="m4 8 8 6 8-6" />
      </svg>
    );
  }

  if (type === 'phone') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.7 3.8h2.6l1.3 4.4-1.7 1.7a15 15 0 0 0 6 6l1.7-1.7 4.4 1.3v2.6a1.8 1.8 0 0 1-2 1.8A17.2 17.2 0 0 1 5 5.8a1.8 1.8 0 0 1 1.7-2Z" />
      </svg>
    );
  }

  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function AuthField({
  label,
  icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  minLength,
}) {
  return (
    <div className="auth-split-input-group">
      <label>{label}</label>
      <div className="auth-split-input-wrap">
        <span className="auth-split-input-icon">
          <AuthIcon type={icon} />
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className="auth-split-input"
        />
      </div>
    </div>
  );
}

function AuthCopyPanel({ block, className }) {
  return (
    <section className={`auth-split-copy ${className}`}>
      <div className="auth-split-copy-brand">
        <BrandLogo showWordmark={false} markClassName="h-14 w-14 sm:h-16 sm:w-16" />
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.34em] text-white/75 sm:text-[0.72rem]">
            Jeevanam 360
          </p>
          <p className="mt-1 text-sm font-semibold text-white/92 sm:text-base">Yoga | Wellness | Balance</p>
        </div>
      </div>
      <p className="auth-split-copy-eye">{block.eyebrow}</p>
      <h1 className="auth-split-copy-title">{block.title}</h1>
    </section>
  );
}

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, isAuthenticating } = useAuth();
  const [loginForm, setLoginForm] = useState(loginDefaults);
  const [signupForm, setSignupForm] = useState(signupDefaults);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const redirectTo = searchParams.get('redirect') || '/contact';
  const isSignup = mode === 'signup';

  function setMode(nextMode) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('mode', nextMode);
    setSearchParams(nextParams);
    setStatus({ type: 'idle', message: '' });
  }

  function updateLoginField(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  }

  function updateSignupField(field, value) {
    setSignupForm((current) => ({ ...current, [field]: value }));
    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    try {
      await login(loginForm);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not log you in.' });
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (signupForm.password !== signupForm.confirmPassword) {
      setStatus({ type: 'error', message: 'Password and confirm password must match.' });
      return;
    }

    try {
      await signup({
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        password: signupForm.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not create your account.' });
    }
  }

  return (
    <div className={`auth-split-shell ${isSignup ? 'is-sign-up' : 'is-sign-in'}`}>
      <div className="auth-split-stage">
        <div aria-hidden="true" className="auth-split-orb auth-split-orb-one" />
        <div aria-hidden="true" className="auth-split-orb auth-split-orb-two" />
        <div aria-hidden="true" className="auth-split-orb auth-split-orb-three" />
        <div aria-hidden="true" className="auth-split-backdrop" />

        <AuthCopyPanel block={copyContent.signIn} className="auth-copy-sign-in" />
        <AuthCopyPanel block={copyContent.signUp} className="auth-copy-sign-up" />

        <div className="auth-split-form-card auth-form-sign-up">
          <div className="auth-split-form-box">
            <h2 className="auth-split-form-title">Sign Up</h2>

            <form onSubmit={handleSignupSubmit}>
              <AuthField
                label="Full Name"
                icon="user"
                value={signupForm.name}
                onChange={(event) => updateSignupField('name', event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              <AuthField
                label="Email"
                icon="mail"
                type="email"
                value={signupForm.email}
                onChange={(event) => updateSignupField('email', event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
              <AuthField
                label="WhatsApp Number"
                icon="phone"
                value={signupForm.phone}
                onChange={(event) => updateSignupField('phone', event.target.value)}
                placeholder="Enter your WhatsApp number"
                autoComplete="tel"
              />
              <AuthField
                label="Password"
                icon="lock"
                type="password"
                value={signupForm.password}
                onChange={(event) => updateSignupField('password', event.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
              />
              <AuthField
                label="Confirm Password"
                icon="lock"
                type="password"
                value={signupForm.confirmPassword}
                onChange={(event) => updateSignupField('confirmPassword', event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={6}
              />

              {status.type === 'error' && isSignup ? (
                <div className="auth-split-status auth-split-status-error">{status.message}</div>
              ) : null}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="btn-primary auth-split-submit disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAuthenticating ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>

            <p className="auth-split-switch">
              <span>Already have an account?</span>
              <button type="button" onClick={() => setMode('login')}>
                Sign in here
              </button>
            </p>
          </div>
        </div>

        <div className="auth-split-form-card auth-form-sign-in">
          <div className="auth-split-form-box">
            <h2 className="auth-split-form-title">Sign In</h2>

            <form onSubmit={handleLoginSubmit}>
              <AuthField
                label="Email"
                icon="mail"
                type="email"
                value={loginForm.email}
                onChange={(event) => updateLoginField('email', event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
              <AuthField
                label="Password"
                icon="lock"
                type="password"
                value={loginForm.password}
                onChange={(event) => updateLoginField('password', event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              {status.type === 'error' && !isSignup ? (
                <div className="auth-split-status auth-split-status-error">{status.message}</div>
              ) : null}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="btn-primary auth-split-submit disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAuthenticating ? 'Signing In...' : 'Sign in'}
              </button>
            </form>

            <p className="auth-split-switch">
              <span>Don&apos;t have an account?</span>
              <button type="button" onClick={() => setMode('signup')}>
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
