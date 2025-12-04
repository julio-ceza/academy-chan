// app/forgot-password/page.js - Página de Recuperação de Senha
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula envio de email de recuperação
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Notificação de sucesso
      const successOverlay = document.createElement('div');
      successOverlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center';
      successOverlay.style.animation = 'fadeIn 0.3s ease-out';
      
      const successDiv = document.createElement('div');
      successDiv.className = 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-10 py-8 rounded-2xl shadow-2xl border-2 border-emerald-400 max-w-md mx-4';
      successDiv.style.animation = 'slideInScale 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      successDiv.innerHTML = `
          <style>
              @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
              }
              @keyframes slideInScale {
                  0% { transform: scale(0.5) translateY(-50px); opacity: 0; }
                  100% { transform: scale(1) translateY(0); opacity: 1; }
              }
              @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
              }
              .email-animate { animation: pulse 1s ease-in-out infinite; }
          </style>
          <div class="text-6xl mb-4 email-animate">📧</div>
          <div class="text-2xl font-black mb-2">Email Enviado!</div>
          <div class="text-base mb-3">Verifique sua caixa de entrada</div>
          <div class="text-sm opacity-90">Enviamos instruções para <strong>${email}</strong></div>
      `;
      successOverlay.appendChild(successDiv);
      document.body.appendChild(successOverlay);
      
      setTimeout(() => {
        successOverlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
          successOverlay.remove();
          router.push('/');
        }, 300);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNiwgMTg1LCAxMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-emerald-500/30 w-full max-w-md glow-green">
        {/* Botão Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Login
        </Link>

        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                    <span className="text-5xl">🔐</span>
                </div>
              </div>
              <h1 className="text-4xl font-black mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400">Esqueceu</span>
                <span className="text-white"> a Senha?</span>
              </h1>
              <p className="text-slate-300 text-sm">
                Sem problemas! Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-emerald-400 mb-2">
                  📧 Email
                </label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="seu-email@exemplo.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
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
                className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all transform shadow-lg shadow-emerald-500/50 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-emerald-500/70'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ENVIANDO EMAIL...
                  </span>
                ) : '📨 ENVIAR INSTRUÇÕES'}
              </button>

              <div className="text-center mt-6">
                <p className="text-slate-400 text-sm">
                  Lembrou sua senha?{' '}
                  <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    Faça login
                  </Link>
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-7xl mb-6 animate-bounce">✅</div>
            <h2 className="text-3xl font-black text-white mb-3">Email Enviado!</h2>
            <p className="text-slate-300 mb-6">
              Verifique sua caixa de entrada em <span className="text-emerald-400 font-bold">{email}</span>
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-300">
                💡 <strong>Dica:</strong> Se não receber o email em alguns minutos, verifique sua pasta de spam.
              </p>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/50"
            >
              Voltar ao Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
