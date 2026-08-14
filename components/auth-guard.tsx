'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const publicRoutes = ['/login', '/showcase'];
    
    // Allow public routes
    if (publicRoutes.includes(pathname)) {
      setIsAuthorized(true);
      return;
    }

    // Check auth
    const user = localStorage.getItem('user_srmt');
    if (!user) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Don't render protected children until authorized
  if (!isAuthorized && !['/login', '/showcase'].includes(pathname)) {
    return <div className="min-h-screen bg-[#050505]" />; // Tela de fundo neutra enquanto redireciona
  }

  return <>{children}</>;
}
