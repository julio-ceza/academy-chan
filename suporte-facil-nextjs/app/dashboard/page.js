// app/dashboard/page.js - Rota do Dashboard do AGENTE
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchTickets } from '@/lib/api'; 

export default function AgentDashboardPage() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      setFilteredTickets(response.data);
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter(ticket => 
        ticket.number.toLowerCase().includes(value.toLowerCase()) ||
        ticket.id.toString().includes(value)
      );
      setFilteredTickets(filtered);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-emerald-500/20 shadow-xl p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
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
          <div className="flex items-center gap-4">
            <span className="font-medium text-emerald-300">👋 Olá, {user?.name}</span>
            <button 
              onClick={handleLogout} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all transform hover:scale-105 font-medium shadow-lg shadow-red-500/30"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 pt-10">
        {/* Hero Section Agente */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-10 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full -ml-28 -mb-28"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white mb-3 flex items-center gap-3">
              🛡️ Painel de Suporte
            </h1>
            <p className="text-xl text-emerald-50 mb-6">Central de gerenciamento de chamados e atendimento ao cliente.</p>
            
            {/* Estatísticas do Agente */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30">
                <div className="text-4xl font-black text-white">{tickets.length}</div>
                <div className="text-sm text-emerald-50 font-medium">Total de Chamados</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30">
                <div className="text-4xl font-black text-amber-300">{tickets.filter(t => t.status === 'Pendente').length}</div>
                <div className="text-sm text-emerald-50 font-medium">Pendentes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30">
                <div className="text-4xl font-black text-blue-300">{tickets.filter(t => t.status === 'Em andamento').length}</div>
                <div className="text-sm text-emerald-50 font-medium">Em Andamento</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30">
                <div className="text-4xl font-black text-emerald-200">{tickets.filter(t => t.status === 'Resolvido').length}</div>
                <div className="text-sm text-emerald-50 font-medium">Resolvidos</div>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-1">📦 Gerenciar Chamados</h2>
              <p className="text-slate-400">Exibindo <span className="text-emerald-400 font-bold">{filteredTickets.length}</span> de <span className="text-emerald-400 font-bold">{tickets.length}</span> chamados no sistema</p>
            </div>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="🔍 Buscar por ID ou número..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-slate-900/70 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-16">
               <svg className="animate-spin h-12 w-12 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <p className="text-slate-400 font-medium">Carregando chamados do sistema...</p>
             </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-emerald-400 text-xs uppercase tracking-wider">
                    <th className="p-5 font-bold">Número</th>
                    <th className="p-5 font-bold">Assunto</th>
                    <th className="p-5 font-bold">Cliente</th>
                    <th className="p-5 font-bold">Status</th>
                    <th className="p-5 font-bold">Data/Hora</th>
                    <th className="p-5 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="text-6xl mb-4">{searchTerm ? '🔍' : '📦'}</div>
                          <p className="text-xl font-bold text-slate-300 mb-2">
                            {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum chamado no sistema'}
                          </p>
                          <p className="text-slate-400">
                            {searchTerm ? 'Tente buscar com outro termo' : 'Aguardando novos chamados'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTickets.map((ticket, index) => (
                    <tr key={ticket.id} className="group hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700/30 last:border-0" style={{animationDelay: `${index * 50}ms`}}>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-2 font-black text-emerald-400 text-lg">
                          {ticket.number}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{ticket.subject}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                            {ticket.clientName.charAt(0)}
                          </div>
                          <span className="text-slate-300 font-medium">{ticket.clientName}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          {ticket.status === 'Resolvido' ? (
                            <>
                              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Resolvido
                              </span>
                              <span className="text-sm text-slate-300 font-medium">{ticket.resolvedAt}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Aberto
                              </span>
                              <span className="text-sm text-slate-300 font-medium">{ticket.createdAt}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <Link href={`/ticket/${ticket.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 border-2 border-emerald-500/50 hover:border-emerald-500 text-emerald-400 hover:text-white font-bold rounded-xl transition-all transform hover:scale-105">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
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