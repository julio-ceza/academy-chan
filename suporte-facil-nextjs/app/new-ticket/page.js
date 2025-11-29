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
            alert(`Chamado ${response.data.number} criado com sucesso!`);
            // Volta para o dashboard do cliente
            router.push('/client-dashboard');

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
        <div className="min-h-screen bg-client-bg">
            <header className="bg-white text-secondary-saas shadow-lg p-4 sticky top-0 z-10 border-b border-gray-200">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                  <h1 className="text-2xl font-bold tracking-wider text-primary-saas">SUPORTE FÁCIL (Cliente)</h1>
                  <Link href="/client-dashboard" className="text-gray-600 hover:text-secondary-saas font-semibold flex items-center">
                     ← Voltar ao Painel
                  </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 pt-10">
                <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-t-4 border-primary-saas">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Abrir Novo Chamado 🚀</h1>
                    <p className="text-lg text-gray-600">Preencha os detalhes da sua solicitação. Lembre-se: Você só pode ter um chamado em aberto por vez.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 space-y-6">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Assunto/Título</label>
                        <input 
                            id="subject"
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ex: Problema com o faturamento de Setembro"
                            required
                            maxLength={100}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saas"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Detalhes da Solicitação</label>
                        <textarea 
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva seu problema ou dúvida de forma clara e detalhada."
                            rows={6}
                            required
                            maxLength={1000}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saas resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 font-medium text-center border p-3 bg-red-50 rounded-lg">{error}</p>
                    )}
                    
                    <button
                        type="submit"
                        className={`w-full bg-primary-saas hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition transform shadow-lg ${
                            isLoading || subject.trim() === '' || description.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                        }`}
                        disabled={isLoading || subject.trim() === '' || description.trim() === ''}
                    >
                        {isLoading ? 'CRIANDO CHAMADO...' : 'ENVIAR SOLICITAÇÃO'}
                    </button>
                </form>
            </main>
        </div>
    );
}