
export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    image: string;
    gradient: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Productos Frescos',
    subtitle: 'Directamente del campo a tu mesa',
    description: 'La mejor calidad en frutas, verduras y productos frescos',
    cta: 'Ver productos',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop&q=80',
    gradient: 'from-green-900/80 via-green-800/60 to-transparent',
  },
  {
    id: 2,
    title: 'Entrega Rápida',
    subtitle: 'En 30 minutos o menos',
    description: 'Recibe tus productos en tiempo récord',
    cta: 'Pedir ahora',
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&h=600&fit=crop&q=80',
    gradient: 'from-blue-900/80 via-blue-800/60 to-transparent',
  },
  {
    id: 3,
    title: 'Ofertas Especiales',
    subtitle: 'Ahorra hasta 40% en productos seleccionados',
    description: 'Descuentos exclusivos para ti',
    cta: 'Ver ofertas',
    image:
      'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&h=600&fit=crop&q=80',
    gradient: 'from-orange-900/80 via-orange-800/60 to-transparent',
  },
];
