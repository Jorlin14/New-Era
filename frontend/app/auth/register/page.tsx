import { redirect } from 'next/navigation';

// REDIRECT TO UNIFIED AUTH (REGISTER MODE)
export default function RegisterPage() {
  redirect('/auth?mode=register');
}
