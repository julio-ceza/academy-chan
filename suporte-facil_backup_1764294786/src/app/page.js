'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f7fa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', color: '#333' }}>
        <h1 style={{ marginBottom: '10px' }}>SUPORTE FÁCIL</h1>
        <p>Carregando...</p>
      </div>
    </div>
  );
}