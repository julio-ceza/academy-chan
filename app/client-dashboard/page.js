// app/client-dashboard/page.js - Rota do Dashboard do CLIENTE
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchTickets } from '@/lib/api'; 

export default function ClientDashboardPage() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOpenTicket, setHasOpenTicket] = useState(false); // Flag para o limite de 1
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    // Verifica autenticação e papel
    if (!userData || userData.role !== 'client') {
      router.push('/');
      return;
    }
    setUser(userData);
    loadTickets(userData.id, userData.role);
  }, [router]);

  const loadTickets = async (userId, userRole) => {
    setIsLoading(true);
    try {
      const response = await fetchTickets(userId, userRole);
      setTickets(response.data);
      // Lê o metadado que indica se existe um chamado aberto
      setHasOpenTicket(response.meta.hasOpenTicket); 
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/');
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'resolvido': return 'tag-resolved';
      case 'em andamento': return 'tag-in-progress';
      case 'pendente': return 'tag-pending';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && !user) { 
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-800 text-xl font-bold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-client-bg">
      <header className="bg-white text-secondary-saas shadow-lg p-4 sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider text-primary-saas">SUPORTE FÁCIL (Cliente)</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-600">Olá, {user?.name}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 pt-10">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-t-4 border-primary-saas">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Meus Chamados 📋</h1>
          <p className="text-lg text-gray-600 mb-4">Acompanhe o status de suas solicitações.</p>
          
          {/* BOTÃO NOVO CHAMADO: Ativado/Desativado pela regra de negócio */}
          <div className="mt-6">
             {hasOpenTicket ? (
                 <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center font-medium">
                    ⚠️ Você já tem um chamado em aberto (Em andamento ou Pendente). Por favor, acompanhe o chamado existente antes de abrir um novo.
                 </div>
             ) : (
                <Link href="/new-ticket" className="inline-block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition transform hover:-translate-y-0.5 text-center shadow-md">
                    + ABRIR NOVO CHAMADO
                </Link>
             )}
          </div>
          
        </div>

        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Minhas Solicitações ({tickets.length})</h2>
          {isLoading ? (
             <div className="text-center py-8 text-gray-500">Carregando chamados...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-3 border-b">Número</th>
                    <th className="p-3 border-b">Assunto</th>
                    <th className="p-3 border-b">Status</th>
                    <th className="p-3 border-b">Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition border-b last:border-0">
                      <td className="p-3 font-semibold text-blue-600">{ticket.number}</td>
                      <td className="p-3 text-gray-700">{ticket.subject}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/ticket/${ticket.id}`} className="text-primary-saas hover:text-emerald-700 font-semibold transition">
                          Abrir Chat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}