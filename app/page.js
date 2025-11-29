// app/page.js - Rota raiz (Login)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api'; 
import styles from './login/login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('user'); // Padrão: Agente
  const [password, setPassword] = useState('123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const response = await login(username, password);
        const user = response.data;
        
        sessionStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'agent') {
            router.push('/dashboard');
        } else if (user.role === 'client') {
            router.push('/client-dashboard');
        }

    } catch (err) {
        console.error('Login Error:', err);
        const errorMessage = err.response?.data?.message || 'Erro de conexão ou credenciais inválidas.';
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.logo}>
            <h1>SUPORTE FÁCIL</h1>
        </div>
        
        <div className={styles.loginHeader}>
            <h2>ACESSO AO SISTEMA</h2>
            <p>Entre com suas credenciais para acessar o painel.</p>
        </div>
        
        <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className='mb-4'>
                <input 
                    type="text" 
                    placeholder="Usuário (Agente: user / Cliente: cliente)" 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className={styles.formGroup}
                />
            </div>
            <div className='mb-4'>
                <input 
                    type="password" 
                    placeholder="Senha (Agente: 123 / Cliente: 456)" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={styles.formGroup}
                />
            </div>

            {error && (
                <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>
            )}
            
            <button 
                type="submit" 
                className={`${styles.loginButton} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
            <a href="#" className="block text-center text-blue-500 hover:underline mt-4 text-sm font-semibold">Esqueci minha senha</a>
        </form>
      </div>
    </div>
  );
}