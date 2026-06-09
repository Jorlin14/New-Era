'use client';

import type { ReactNode } from 'react';

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
  minLength?: number;
  required?: boolean;
}

export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon,
  minLength,
  required = true,
}: AuthFieldProps) {
  return (
    <fieldset className="relative group flex items-center gap-3 mb-4 rounded-2xl bg-white/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 backdrop-blur-md px-4 pt-5 pb-2 shadow-sm focus-within:border-[#1c6554] dark:focus-within:border-[#25826c] focus-within:bg-white/10 transition-all">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        placeholder=" "
        className="outline-none peer flex-1 bg-transparent text-slate-900 dark:text-white text-sm font-medium"
      />
      <label
        htmlFor={id}
        className="absolute left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#1c6554] dark:peer-focus:text-[#38b398] top-1 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all pointer-events-none"
      >
        {label}
      </label>
      <span className="text-slate-500 dark:text-slate-400 shrink-0 peer-focus:text-[#1c6554] dark:peer-focus:text-[#38b398] transition-colors">{icon}</span>
    </fieldset>
  );
}
