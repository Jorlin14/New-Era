
interface CategoryIconProps {
    name: string;
    className?: string;
}

export default function CategoryIcon({ name, className = "w-12 h-12" }: CategoryIconProps) {
  const iconClass = `${className} transition-all`;

  switch (name) {
    case 'Frutas y Verduras':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <path d="M32 12c-2.5 0-4.5 1.5-5 3.5-.5-2-2.5-3.5-5-3.5-3 0-5.5 2.5-5.5 5.5 0 4 4.5 8.5 10.5 13.5 6-5 10.5-9.5 10.5-13.5 0-3-2.5-5.5-5.5-5.5z" fill="#22C55E"/>
          <ellipse cx="32" cy="38" rx="14" ry="16" fill="#86EFAC"/>
          <ellipse cx="32" cy="38" rx="11" ry="13" fill="#4ADE80"/>
          <path d="M28 32c0-1 .5-2 1.5-2.5.5-.3 1-.5 1.5-.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M36 32c0-1-.5-2-1.5-2.5-.5-.3-1-.5-1.5-.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'Lácteos y Huevos':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <rect x="22" y="16" width="20" height="28" rx="2" fill="#E0F2FE"/>
          <rect x="22" y="16" width="20" height="6" rx="2" fill="#0EA5E9"/>
          <path d="M26 26h12M26 30h12M26 34h12M26 38h12" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
          <rect x="24" y="44" width="16" height="6" rx="1" fill="#BAE6FD"/>
        </svg>
      );

    case 'Carnes y Pescados':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <path d="M32 16c-8 0-14 6-14 14s6 14 14 14 14-6 14-14-6-14-14-14z" fill="#FCA5A5"/>
          <path d="M32 20c-6 0-10 4-10 10s4 10 10 10 10-4 10-10-4-10-10-10z" fill="#EF4444"/>
          <ellipse cx="28" cy="28" rx="3" ry="4" fill="#FCA5A5" opacity="0.6"/>
          <ellipse cx="36" cy="32" rx="2.5" ry="3.5" fill="#FCA5A5" opacity="0.6"/>
          <path d="M26 34c1 1.5 2.5 2.5 6 2.5s5-1 6-2.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'Panadería':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <path d="M20 38c0-8 5-14 12-14s12 6 12 14z" fill="#FED7AA"/>
          <path d="M20 38h24v8c0 2-1.5 4-4 4h-16c-2.5 0-4-2-4-4v-8z" fill="#FDBA74"/>
          <ellipse cx="26" cy="32" rx="2" ry="3" fill="#F97316"/>
          <ellipse cx="32" cy="30" rx="2" ry="3" fill="#F97316"/>
          <ellipse cx="38" cy="32" rx="2" ry="3" fill="#F97316"/>
          <path d="M22 42h20" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'Bebidas':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <path d="M26 14h12l2 36h-16l2-36z" fill="#DBEAFE"/>
          <path d="M26 14h12v8h-12v-8z" fill="#93C5FD"/>
          <rect x="28" y="8" width="8" height="4" rx="1" fill="#60A5FA"/>
          <path d="M26 22h12v18c0 2-2 4-6 4s-6-2-6-4V22z" fill="#3B82F6"/>
          <ellipse cx="32" cy="28" rx="4" ry="2" fill="#BFDBFE" opacity="0.4"/>
          <path d="M30 10v4M34 10v4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'Despensa':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <rect x="20" y="20" width="24" height="28" rx="2" fill="#FEF3C7"/>
          <rect x="20" y="20" width="24" height="8" rx="2" fill="#FDE047"/>
          <path d="M24 32h16M24 36h16M24 40h16" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="32" cy="24" r="2" fill="#CA8A04"/>
          <rect x="28" y="42" width="8" height="4" rx="1" fill="#FEF08A"/>
        </svg>
      );

    case 'Snacks y Dulces':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <rect x="18" y="26" width="28" height="16" rx="2" fill="#FDE68A"/>
          <path d="M18 30c0-2 1-4 2-4h24c1 0 2 2 2 4" fill="#FEF08A"/>
          <rect x="20" y="28" width="24" height="12" rx="1" fill="#FBBF24"/>
          <circle cx="26" cy="34" r="2" fill="#F59E0B"/>
          <circle cx="32" cy="34" r="2" fill="#D97706"/>
          <circle cx="38" cy="34" r="2" fill="#F59E0B"/>
          <path d="M22 34h2M30 34h2M40 34h2" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'Limpieza y Hogar':
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <path d="M26 14h12l4 36h-20l4-36z" fill="#E0E7FF"/>
          <ellipse cx="32" cy="18" rx="8" ry="4" fill="#C7D2FE"/>
          <path d="M26 20h12v24c0 3-2 6-6 6s-6-3-6-6V20z" fill="#A5B4FC"/>
          <ellipse cx="32" cy="28" rx="5" ry="2" fill="#E0E7FF" opacity="0.5"/>
          <ellipse cx="32" cy="36" rx="4" ry="1.5" fill="#E0E7FF" opacity="0.5"/>
          <rect x="30" y="12" width="4" height="4" rx="1" fill="#818CF8"/>
        </svg>
      );

    case 'Todos los productos':
    default:
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
          <rect x="18" y="22" width="28" height="24" rx="2" fill="#E0F2FE"/>
          <path d="M18 30h28v-8c0-1-1-2-2-2H20c-1 0-2 1-2 2v8z" fill="#0EA5E9"/>
          <rect x="20" y="32" width="10" height="10" rx="1" fill="#7DD3FC"/>
          <rect x="34" y="32" width="10" height="10" rx="1" fill="#7DD3FC"/>
          <path d="M25 28L32 20l7 8" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="24" r="2" fill="#FEF3C7"/>
        </svg>
      );
  }
}
