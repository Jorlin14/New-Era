'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/shop/Logo';
import AuthField from '@/components/auth/AuthField';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';

type AuthMode = 'login' | 'register';

interface AnimatedAuthProps {
  initialMode?: AuthMode;
}

const ANIMATION_MS = 500;

export default function AnimatedAuth({ initialMode = 'login' }: AnimatedAuthProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'register');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    address: '',
    city: '',
    confirmPassword: ''
  });

  // Desactivar la animación inicial después del primer render
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialMount(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const switchMode = useCallback(
    (toSignUp: boolean) => {
      if (isAnimating || isSignUp === toSignUp) return;
      setHasInteracted(true);
      setError(null);
      setIsAnimating(true);
      setIsSignUp(toSignUp);
      setTimeout(() => setIsAnimating(false), ANIMATION_MS);
    },
    [isAnimating, isSignUp]
  );

  async function handleLoginSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(loginData);
      login(response);
      
      // Redirección condicional según el rol
      if (response.user.role === 'CUSTOMER') {
        router.push('/');
      } else {
        router.push(`/dashboard/${response.user.role.toLowerCase()}`);
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error en la autenticación');
      } else {
        setError('Error en la autenticación');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegisterSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        address: registerData.address,
        city: registerData.city,
      });
      login(response);
      
      if (response.user.role === 'CUSTOMER') {
        router.push('/');
      } else {
        router.push(`/dashboard/${response.user.role.toLowerCase()}`);
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error al crear la cuenta');
      } else {
        setError('Error al crear la cuenta');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const loginFormClass = getPanelAnimationClass('login-form', isSignUp, hasInteracted);
  const loginTextClass = getPanelAnimationClass('login-text', isSignUp, hasInteracted);
  const registerTextClass = getPanelAnimationClass('register-text', isSignUp, hasInteracted);
  const registerFormClass = getPanelAnimationClass('register-form', isSignUp, hasInteracted);

  return (
    <>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[9999] flex items-center gap-2 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all hover:shadow-md rounded-full group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold pr-1">Atrás</span>
        </Link>
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-full hover:shadow-md transition-all">
          <ThemeToggle />
        </div>
      </div>

      {/* Article principal */}
      <article className="bg-white dark:bg-[#0B1121] grid grid-cols-1 lg:grid-cols-2 w-full h-screen relative overflow-hidden">
        {/* LUZ AMBIENTAL DINÁMICA */}
        <div
          className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1c6554]/10 dark:bg-[#1c6554]/20 rounded-full blur-[100px] transition-all duration-1000 ease-in-out z-0 pointer-events-none ${
            isSignUp ? 'left-[-10%]' : 'left-[50%]'
          }`}
          aria-hidden="true"
        />

        {/* LOGIN FORM */}
        <form
          onSubmit={handleLoginSubmit}
          className={`grid gap-8 content-center relative z-10 row-start-1 col-start-1 px-6 sm:px-12 lg:px-20 xl:px-24 pt-24 pb-10 lg:py-10 overflow-y-auto max-h-screen ${
            isInitialMount ? 'opacity-0' : ''
          } ${loginFormClass} ${
            isSignUp ? 'hidden lg:grid' : 'grid'
          }`}
          style={isInitialMount ? { animation: 'fadeIn 0.5s ease-out forwards' } : undefined}
        >
          <AuthFormHeader title="Iniciar sesión" />

          {error && !isSignUp && (
            <div className="bg-red-50 text-red-600 p-3 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <AuthField
            id="login-email"
            label="Correo electrónico"
            type="email"
            value={loginData.email}
            onChange={(email) => setLoginData((prev) => ({ ...prev, email }))}
            icon={<User className="w-5 h-5" />}
          />

          <AuthField
            id="login-password"
            label="Contraseña"
            type="password"
            value={loginData.password}
            onChange={(password) => setLoginData((prev) => ({ ...prev, password }))}
            icon={<Lock className="w-5 h-5" />}
          />

          <div className="text-right -mt-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#1c6554] hover:text-[#1c6554]/70 font-semibold underline underline-offset-2"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <SubmitButton loading={isLoading} disabled={isAnimating} label="Iniciar sesión" loadingLabel="Iniciando..." />

          <p className="text-base text-center text-slate-700 dark:text-slate-300 font-normal">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => switchMode(true)}
              disabled={isAnimating}
              className="font-bold text-[#1c6554] hover:text-[#1c6554]/70 transition-colors underline underline-offset-2"
            >
              Regístrate
            </button>
          </p>
        </form>

        {/* TEXTO DERECHO (visible en modo login) */}
        <div
          className={`hidden lg:flex flex-col justify-center items-center gap-6 relative z-10 row-start-1 col-start-2 px-12 lg:px-20 xl:px-24 ${
            isInitialMount ? 'opacity-0' : ''
          } ${loginTextClass}`}
          style={isInitialMount ? { animation: 'fadeIn 0.5s ease-out 0.2s forwards' } : undefined}
        >
          <div className="absolute inset-0 z-[-1] flex items-center justify-center pointer-events-none opacity-60 dark:opacity-50 transition-opacity duration-1000">
            <svg viewBox="0 0 200 200" className="w-[1100px] h-[1100px] text-[#00b16a] dark:text-[#1c6554] drop-shadow-[0_0_80px_rgba(0,177,106,0.8)] dark:drop-shadow-[0_0_80px_rgba(28,101,84,0.5)] animate-[spin_40s_linear_infinite] transition-colors duration-1000">
              <path fill="currentColor" d="M100 0 C100 50 150 100 200 100 C150 100 100 150 100 200 C100 150 50 100 0 100 C50 100 100 50 100 0 Z" />
            </svg>
          </div>
          <h3 className="text-4xl xl:text-5xl uppercase font-black text-slate-900 dark:text-white text-center leading-tight tracking-tight drop-shadow-sm dark:drop-shadow-lg transition-colors">
            ¡BIENVENIDO!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-sm text-center text-base xl:text-lg leading-relaxed font-medium transition-colors">
            Ingresa tus credenciales para acceder a ofertas exclusivas y recibir tus productos frescos en casa.
          </p>
        </div>

        {/* TEXTO IZQUIERDO (visible en modo registro) */}
        <div
          className={`hidden lg:flex flex-col justify-center items-center gap-6 relative z-10 row-start-1 col-start-1 px-12 lg:px-20 xl:px-24 ${
            isInitialMount ? 'opacity-0' : ''
          } ${registerTextClass}`}
          style={isInitialMount ? { animation: 'fadeIn 0.5s ease-out 0.2s forwards' } : undefined}
        >
          <div className="absolute inset-0 z-[-1] flex items-center justify-center pointer-events-none opacity-60 dark:opacity-50 transition-opacity duration-1000">
            <svg viewBox="0 0 200 200" className="w-[1100px] h-[1100px] text-[#00b16a] dark:text-[#1c6554] drop-shadow-[0_0_80px_rgba(0,177,106,0.8)] dark:drop-shadow-[0_0_80px_rgba(28,101,84,0.5)] animate-[spin_40s_linear_infinite] transition-colors duration-1000">
              <path fill="currentColor" d="M100 0 C100 50 150 100 200 100 C150 100 100 150 100 200 C100 150 50 100 0 100 C50 100 100 50 100 0 Z" />
            </svg>
          </div>
          <h3 className="text-4xl xl:text-5xl uppercase font-black text-slate-900 dark:text-white text-center leading-tight tracking-tight drop-shadow-sm dark:drop-shadow-lg transition-colors">
            ¡ÚNETE AHORA!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-sm text-center text-base xl:text-lg leading-relaxed font-medium transition-colors">
            Crea tu cuenta y disfruta de envío gratis, ofertas exclusivas y entregas en menos de 30 minutos.
          </p>
        </div>

        {/* REGISTER FORM */}
        <form
          onSubmit={handleRegisterSubmit}
          className={`grid gap-6 content-start relative z-10 row-start-1 col-start-2 px-6 sm:px-12 lg:px-20 xl:px-24 pt-24 pb-10 lg:pt-16 lg:pb-10 overflow-y-auto max-h-screen ${
            isInitialMount ? 'opacity-0' : ''
          } ${registerFormClass} ${
            isSignUp ? 'grid' : 'hidden lg:grid'
          }`}
          style={isInitialMount ? { animation: 'fadeIn 0.5s ease-out forwards' } : undefined}
        >
          <AuthFormHeader title="Crear cuenta" />

          {error && isSignUp && (
            <div className="bg-red-50 text-red-600 p-3 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <AuthField
            id="register-name"
            label="Nombre completo"
            value={registerData.name}
            onChange={(name) => setRegisterData((prev) => ({ ...prev, name }))}
            icon={<User className="w-5 h-5" />}
          />

          <AuthField
            id="register-email"
            label="Correo electrónico"
            type="email"
            value={registerData.email}
            onChange={(email) => setRegisterData((prev) => ({ ...prev, email }))}
            icon={<Mail className="w-5 h-5" />}
          />

          <AuthField
            id="register-phone"
            label="Teléfono"
            type="tel"
            value={registerData.phone}
            onChange={(phone) => setRegisterData((prev) => ({ ...prev, phone }))}
            icon={<Phone className="w-5 h-5" />}
          />

          <AuthField
            id="register-address"
            label="Dirección de entrega"
            value={registerData.address}
            onChange={(address) => setRegisterData((prev) => ({ ...prev, address }))}
            icon={<MapPin className="w-5 h-5" />}
          />

          <AuthField
            id="register-city"
            label="Ciudad"
            value={registerData.city}
            onChange={(city) => setRegisterData((prev) => ({ ...prev, city }))}
            icon={<MapPin className="w-5 h-5" />}
          />

          <AuthField
            id="register-password"
            label="Contraseña"
            type="password"
            value={registerData.password}
            onChange={(password) => setRegisterData((prev) => ({ ...prev, password }))}
            icon={<Lock className="w-5 h-5" />}
            minLength={8}
          />

          <AuthField
            id="register-confirm-password"
            label="Confirmar contraseña"
            type="password"
            value={registerData.confirmPassword}
            onChange={(confirmPassword) => setRegisterData((prev) => ({ ...prev, confirmPassword }))}
            icon={<Lock className="w-5 h-5" />}
            minLength={8}
          />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 w-4 h-4 accent-[#1c6554]"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
              Acepto los{' '}
              <a href="/terminos" className="text-[#1c6554] hover:underline font-medium">
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a href="/privacidad" className="text-[#1c6554] hover:underline font-medium">
                política de privacidad
              </a>
            </label>
          </div>

          <SubmitButton loading={isLoading} disabled={isAnimating} label="Crear cuenta" loadingLabel="Creando..." />

          <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-base text-slate-600 dark:text-slate-400">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => switchMode(false)}
                disabled={isAnimating}
                className="font-bold text-[#1c6554] hover:text-[#1c6554]/70 transition-colors underline underline-offset-2"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </form>
    </article>
    </>
  );
}

type PanelId = 'login-form' | 'login-text' | 'register-text' | 'register-form';

function getPanelAnimationClass(panel: PanelId, isSignUp: boolean, hasInteracted: boolean): string {
  if (!hasInteracted) {
    const visible = {
      'login-form': !isSignUp,
      'login-text': !isSignUp,
      'register-text': isSignUp,
      'register-form': isSignUp,
    };
    return visible[panel] ? 'relative' : 'invisible relative';
  }

  const classes: Record<PanelId, { login: string; register: string }> = {
    'login-form': {
      login: 'relative animate-auth-appear-left',
      register: 'invisible relative animate-auth-hide-left',
    },
    'login-text': {
      login: 'relative animate-auth-appear-right',
      register: 'invisible relative animate-auth-hide-right',
    },
    'register-text': {
      login: 'invisible relative animate-auth-hide-left',
      register: 'relative animate-auth-appear-left',
    },
    'register-form': {
      login: 'invisible relative animate-auth-hide-right',
      register: 'relative animate-auth-appear-right',
    },
  };

  return isSignUp ? classes[panel].register : classes[panel].login;
}

function AuthFormHeader({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center lg:text-left text-slate-900 dark:text-white mb-3">
        {title}
      </h2>
      <div className="flex gap-2 justify-center lg:justify-start mb-8">
        <div className="w-8 h-1 bg-gradient-to-r from-[#0C447C] to-[#1c6554] rounded-full"></div>
        <div className="w-4 h-1 bg-[#1c6554] rounded-full opacity-80"></div>
        <div className="w-2 h-1 bg-[#1c6554] rounded-full opacity-60"></div>
      </div>
    </div>
  );
}

function SubmitButton({
  loading,
  disabled,
  label,
  loadingLabel,
}: {
  loading: boolean;
  disabled: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="bg-gradient-to-r from-blue-900/80 to-[#1c6554]/80 backdrop-blur-md shadow-[0_0_20px_rgba(28,101,84,0.4)] border border-white/10 text-white rounded-2xl py-3.5 font-semibold hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(28,101,84,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

