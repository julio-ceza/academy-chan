// app/page.js - Rota raiz (Login)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api'; 
import styles from './login/login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('Julio'); // Padrão: Agente
  const [password, setPassword] = useState('Uninassau');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNiwgMTg1LCAxMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      <div className="relative bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-md glow-green">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50 transform rotate-6">
                    <span className="text-3xl transform -rotate-6">🎓</span>
                </div>
            </div>
            <h1 className="text-5xl font-black mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 drop-shadow-lg" style={{letterSpacing: '0.05em'}}>Academy</span>
                <span className="text-emerald-400 mx-2">•</span>
                <span className="text-white drop-shadow-lg">chan</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Suporte</span>
                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            </div>
        </div>
        
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-400 mb-2 tracking-wide">ACESSO AO SISTEMA</h2>
            <p className="text-slate-300 text-sm">Entre com suas credenciais para acessar o painel.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <input 
                    type="text" 
                    placeholder="👤 Usuário" 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-emerald-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
            </div>
            <div>
                <input 
                    type="password" 
                    placeholder="🔒 Senha" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-emerald-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                </div>
            )}
            
            <button 
                type="submit" 
                className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/50 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-emerald-500/70'}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ENTRANDO...
                    </span>
                ) : 'ENTRAR NO SISTEMA'}
            </button>
            <Link href="/forgot-password" className="block text-center text-emerald-400 hover:text-emerald-300 mt-4 text-sm font-semibold transition-colors">
              ❓ Esqueci minha senha
            </Link>
        </form>
      </div>
    </div>
  );
}