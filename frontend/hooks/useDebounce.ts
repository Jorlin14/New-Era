
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Crear timer que actualiza el valor después del delay
    const timer = setTimeout(() => setDebounced(value), delayMs);
    
    // Limpiar timer si el valor cambia antes de que se cumpla el delay
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
