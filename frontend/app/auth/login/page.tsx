import { redirect } from 'next/navigation';

// REDIRECT TO UNIFIED AUTH
export default function LoginPage() {
  redirect('/auth');
}
