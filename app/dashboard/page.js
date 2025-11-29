// app/dashboard/page.js - Rota do Dashboard do AGENTE
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchTickets } from '@/lib/api'; 

export default function AgentDashboardPage() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    // Verifica autenticação e papel
    if (!userData || userData.role !== 'agent') {
      router.push('/');
      return;
    }
    setUser(userData);
    loadTickets(userData.id, userData.role);
  }, [router]);

  const loadTickets = async (userId, userRole) => {
    setIsLoading(true);
    try {
      // Agente não precisa de userId e role para fetchTickets, mas a função aceita
      const response = await fetchTickets(userId, userRole); 
      setTickets(response.data);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-secondary-saas text-white shadow-lg p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider text-primary-saas">SUPORTE FÁCIL (Agente)</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-200">Olá, {user?.name}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 pt-10">
        <div className="bg-white rounded-xl shadow-xl p-10 mb-10 text-center border-t-4 border-primary-saas">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Painel de Agente 👋</h1>
          <p className="text-xl text-gray-600 mb-4">Gerencie todos os chamados abertos.</p>
        </div>

        <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Todos os Chamados ({tickets.length})</h2>
          {isLoading ? (
             <div className="text-center py-10 text-gray-500">Carregando chamados...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b">Número</th>
                    <th className="p-4 border-b">Assunto</th>
                    <th className="p-4 border-b">Cliente</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition border-b last:border-0">
                      <td className="p-4 font-semibold text-blue-600">{ticket.number}</td>
                      <td className="p-4 text-gray-700">{ticket.subject}</td>
                      <td className="p-4 text-gray-700">{ticket.clientName}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/ticket/${ticket.id}`} className="text-primary-saas hover:text-emerald-700 font-semibold transition">
                          Visualizar Chat
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