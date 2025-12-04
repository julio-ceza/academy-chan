// app/new-ticket/page.js - Formulário para Abrir Novo Chamado (Cliente)
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createTicket } from '@/lib/api'; 

export default function NewTicketPage() {
    const [user, setUser] = useState(null);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        
        // Redireciona se não estiver logado ou não for cliente
        if (!userData || userData.role !== 'client') {
            router.push('/');
            return;
        }
        setUser(userData);
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await createTicket(user, subject, description);
            
            // Notificação de sucesso com animação suave
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center';
            overlay.style.animation = 'fadeIn 0.3s ease-out';
            
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
                    .emoji-animate { animation: pulse 1s ease-in-out infinite; }
                </style>
                <div class="text-6xl mb-4 emoji-animate">🎉</div>
                <div class="text-2xl font-black mb-2">Sucesso!</div>
                <div class="text-lg font-semibold mb-3">Chamado ${response.data.number} criado com sucesso!</div>
                <div class="flex items-center justify-center gap-2 text-sm opacity-90">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecionando para o painel...
                </div>
            `;
            overlay.appendChild(successDiv);
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
                setTimeout(() => {
                    overlay.remove();
                    router.push('/client-dashboard');
                }, 300);
            }, 2500);

        } catch (err) {
            console.error('Erro ao criar chamado:', err);
            // Captura a mensagem de erro da regra de negócio (limite de 1)
            const errorMessage = err.response?.data?.message || 'Erro de conexão ao tentar criar o chamado.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!user) {
        return <div className="text-center py-20">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <header className="bg-slate-800/50 backdrop-blur-xl border-b border-emerald-500/20 shadow-xl p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
                        <span className="text-xl transform -rotate-6">🎓</span>
                    </div>
                    <h1 className="text-2xl font-black">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Academy</span>
                        <span className="text-emerald-400 mx-1">•</span>
                        <span className="text-white">chan</span>
                    </h1>
                  </div>
                  <Link href="/client-dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 transition-colors">
                     ← Voltar ao Painel
                  </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 pt-10">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-emerald-500/30 glow-green">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">Abrir Novo Chamado 🚀</h1>
                    <p className="text-lg text-slate-300">Preencha os detalhes da sua solicitação com atenção.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-emerald-500/20 space-y-6">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-emerald-400 mb-2">📝 Assunto/Título</label>
                        <input 
                            id="subject"
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ex: Problema com o faturamento de Setembro"
                            required
                            maxLength={100}
                            className="w-full p-3 bg-slate-900/50 border border-emerald-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-emerald-400 mb-2">💬 Detalhes da Solicitação</label>
                        <textarea 
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva seu problema ou dúvida de forma clara e detalhada."
                            rows={6}
                            required
                            maxLength={1000}
                            className="w-full p-3 bg-slate-900/50 border border-emerald-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 resize-none transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                            <p className="text-red-400 font-medium text-center">{error}</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all transform shadow-xl shadow-emerald-500/50 ${
                            isLoading || subject.trim() === '' || description.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-emerald-500/70'
                        }`}
                        disabled={isLoading || subject.trim() === '' || description.trim() === ''}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                CRIANDO CHAMADO...
                            </span>
                        ) : '✨ ENVIAR SOLICITAÇÃO'}
                    </button>
                </form>
            </main>
        </div>
    );
}