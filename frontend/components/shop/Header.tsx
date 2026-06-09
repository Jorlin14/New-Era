import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@/components/shop/Logo';
import CartDrawer from '@/components/shop/CartDrawer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrencyToggle } from '@/components/currency-toggle';
import { getProducts } from '@/lib/api/products';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { User, Search, X, ShoppingCart, MapPin } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);
  
  // Search Autocomplete State
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRefDesktop = useRef<HTMLDivElement>(null);
  const searchContainerRefMobile = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Fetch suggestions
  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedSearch.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const results = await getProducts(debouncedSearch);
        setSuggestions(results.slice(0, 6)); // Show top 6 results
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }
    fetchSuggestions();
  }, [debouncedSearch]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRefDesktop.current &&
        !searchContainerRefDesktop.current.contains(event.target as Node) &&
        searchContainerRefMobile.current &&
        !searchContainerRefMobile.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderSuggestionsDropdown = () => {
    if (!showSuggestions || debouncedSearch.length < 2) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
        {isLoadingSuggestions ? (
          <div className="p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-[#1c6554] rounded-full animate-spin" />
            Buscando...
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="max-h-[60vh] overflow-y-auto py-2">
            {suggestions.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setShowSuggestions(false);
                    router.push(`/products/${product.id}`);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#1c6554] dark:group-hover:text-emerald-400 transition-colors">{product.name}</p>
                    <p className="text-sm font-bold text-[#1c6554] dark:text-emerald-400">{formatPrice(product.price)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Sin resultados</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No encontramos productos para "{debouncedSearch}"</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
          <div className="flex items-center justify-between gap-6 sm:gap-10 h-18 sm:h-22 py-4">
            
            
            <div className="flex-shrink-0 pr-4 sm:pr-8">
              <Logo size="lg" />
            </div>

            
            <div className="flex-1 max-w-2xl hidden sm:block mx-4">
              <div className="relative" ref={searchContainerRefDesktop}>
                <input
                  type="search"
                  placeholder="Buscar productos, marcas..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full h-11 pl-11 pr-4 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#1c6554] focus:ring-2 focus:ring-[#1c6554]/20 transition-all rounded-full shadow-sm"
                  aria-label="Buscar productos"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setShowSuggestions(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {renderSuggestionsDropdown()}
              </div>
            </div>

            
            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <CurrencyToggle />
              <ThemeToggle />

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 hover:text-[#1c6554] transition-colors focus:outline-none bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                    <div className="w-7 h-7 rounded-full bg-[#1c6554]/10 text-[#1c6554] dark:bg-[#1c6554]/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200 hidden sm:inline-block pr-1">{user?.name?.split(' ')[0] ?? ''}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      render={
                        <Link href={user?.role === 'CUSTOMER' ? '/dashboard/customer' : `/dashboard/${user?.role?.toLowerCase() ?? ''}`} />
                      }
                    >
                      Mi Perfil
                    </DropdownMenuItem>
                    {user?.role === 'CUSTOMER' && (
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                        render={<Link href="/dashboard/customer/orders" />}
                      >
                        Mis Órdenes
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700" />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <div className="hidden sm:flex items-center gap-4">
                    <Link href="/auth" className="text-slate-600 dark:text-slate-300 hover:text-[#1c6554] dark:hover:text-emerald-400 transition-colors font-medium text-sm">
                      Iniciar sesión
                    </Link>
                    <Link href="/auth?mode=register" className="bg-[#1c6554] hover:bg-[#1c6554]/90 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors shadow-sm">
                      Registrarse
                    </Link>
                  </div>
                  <Link href="/auth" className="sm:hidden flex items-center justify-center w-9 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all rounded-full" aria-label="Iniciar sesión">
                    <User className="w-4 h-4" />
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all rounded-full"
                aria-label="Abrir carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1c6554] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          
          <div className="sm:hidden pb-4">
            <div className="relative" ref={searchContainerRefMobile}>
              <input
                type="search"
                placeholder="Buscar productos..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-11 pl-11 pr-4 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#1c6554] focus:ring-2 focus:ring-[#1c6554]/20 transition-all rounded-full"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setShowSuggestions(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {renderSuggestionsDropdown()}
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}






