'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Logo from '@/components/shop/Logo';

type AuthType = 'login' | 'register' | 'forgot-password';

interface AuthLayoutProps {
  children: ReactNode;
  type: AuthType;
}

const BRANDING: Record<
  AuthType,
  { title: string; description: string; features: string[]; gradient: string }
> = {
  login: {
    title: 'Compra más rápido y fácil',
    description:
      'Accede a ofertas exclusivas, guarda tus direcciones favoritas y realiza seguimiento de tus pedidos en tiempo real.',
    features: [
      'Envío gratis en compras mayores a $50.000',
      'Descuentos exclusivos para miembros',
      'Historial de compras y listas de favoritos',
    ],
    gradient: 'from-[#0C447C] via-[#0C447C] to-[#1c6554]',
  },
  register: {
    title: 'Únete a nuestra comunidad',
    description:
      'Crea tu cuenta y comienza a disfrutar de todos los beneficios que tenemos para ti.',
    features: [
      'Registro rápido y seguro',
      'Acceso a promociones especiales',
      'Programa de puntos y recompensas',
      'Soporte prioritario 24/7',
    ],
    gradient: 'from-[#1c6554] via-[#1c6554] to-[#0C447C]',
  },
  'forgot-password': {
    title: 'Recupera tu acceso',
    description:
      'Te enviaremos un enlace seguro para restablecer tu contraseña y volver a comprar en minutos.',
    features: [
      'Proceso seguro y verificado',
      'Enlace válido por 24 horas',
      'Soporte disponible si necesitas ayuda',
    ],
    gradient: 'from-[#0C447C] via-[#0C447C] to-[#1c6554]',
  },
};

const FOOTER_LINKS: Record<AuthType, { text: string; href: string; label: string } | null> = {
  login: { text: '¿No tienes una cuenta?', href: '/auth/register', label: 'Regístrate gratis' },
  register: { text: '¿Ya tienes una cuenta?', href: '/auth/login', label: 'Inicia sesión' },
  'forgot-password': { text: '¿Recordaste tu contraseña?', href: '/auth', label: 'Volver al login' },
};

export default function AuthLayout({ children, type }: AuthLayoutProps) {
  const pathname = usePathname();
  const branding = BRANDING[type];
  const footerLink = FOOTER_LINKS[type];
  const showBrandingOnRight = type === 'login' || type === 'forgot-password';

  return (
    <div className="min-h-screen flex">
      {!showBrandingOnRight && <BrandingPanel {...branding} />}

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-900 custom-scrollbar overflow-y-auto">
        <div key={pathname} className="w-full max-w-md animate-slide-right">
          <Logo size="md" className="mb-8" />
          {children}

          {footerLink && (
            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {footerLink.text}{' '}
              <Link
                href={footerLink.href}
                className="text-[#1c6554] hover:text-[#1c6554]/80 font-semibold"
              >
                {footerLink.label}
              </Link>
            </p>
          )}
        </div>
      </div>

      {showBrandingOnRight && <BrandingPanel {...branding} />}
    </div>
  );
}

interface BrandingPanelProps {
  title: string;
  description: string;
  features: string[];
  gradient: string;
}

function BrandingPanel({ title, description, features, gradient }: BrandingPanelProps) {
  return (
    <div
      className={`hidden lg:flex flex-1 bg-gradient-to-br ${gradient} p-12 items-center justify-center relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md text-white animate-scale-in">
        <h2 className="text-4xl font-bold mb-6">{title}</h2>
        <p className="text-lg text-white/90 mb-8">{description}</p>

        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={feature}
              className="flex items-center gap-3 animate-slide-right"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="w-6 h-6 bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-white/90">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
