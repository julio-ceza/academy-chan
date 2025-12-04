// app/ticket/[id]/page.js - Tela de Chat Compartilhada (Com botão de Concluir)
'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
// Importa as funções resolveTicket e cancelTicket
import { fetchTicketDetails, sendMessage, resolveTicket, cancelTicket } from '@/lib/api'; 

export default function TicketDetailPage() {
  const { id } = useParams(); // Pega o ID do chamado da URL
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isResolving, setIsResolving] = useState(false); // State para o botão de resolução
  const messagesEndRef = useRef(null); // Para auto-scroll

  // Função para rolar o chat para o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Carregar dados do ticket e usuário
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(userData);
    
    const loadDetails = async () => {
      try {
        const response = await fetchTicketDetails(id);
        setTicket(response.data);
        setMessages(response.data.history);
      } catch (error) {
        console.error('Erro ao buscar detalhes do ticket:', error);
        alert('Chamado não encontrado.');
        router.push(userData.role === 'agent' ? '/dashboard' : '/client-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [id, router]);

  // 2. Auto-scroll ao receber novas mensagens
  useEffect(scrollToBottom, [messages]);
  
  // 3. Envio de mensagem
  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isSending || ticket.status === 'Resolvido') return;

    setIsSending(true);

    try {
        const response = await sendMessage(
            id,
            user.name,
            user.role,
            newMessage
        );
        
        // Adiciona a nova mensagem à lista local
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Falha ao enviar mensagem.');
    } finally {
        setIsSending(false);
    }
  };
  
  // 4. Conclusão do chamado (FUNÇÃO PRINCIPAL PARA O AGENTE)
  const handleResolve = async () => {
    // Modal de confirmação customizado para resolução
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center';
    confirmOverlay.style.animation = 'fadeIn 0.3s ease-out';
    
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'bg-gradient-to-br from-slate-800 to-slate-900 text-white px-8 py-6 rounded-2xl shadow-2xl border-2 border-emerald-500/50 max-w-md mx-4';
    confirmDiv.style.animation = 'slideInScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    confirmDiv.innerHTML = `
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInScale {
                0% { transform: scale(0.5) translateY(-50px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            .btn-cancel-resolve:hover { transform: scale(1.05); }
            .btn-confirm-resolve:hover { transform: scale(1.05); }
        </style>
        <div class="text-5xl mb-4 text-center">✅</div>
        <div class="text-2xl font-bold mb-3 text-center">Concluir Chamado</div>
        <div class="text-base text-slate-300 mb-2 text-center">Deseja marcar como resolvido o chamado:</div>
        <div class="text-lg font-bold text-emerald-400 mb-4 text-center">${ticket.number}?</div>
        <div class="text-sm text-slate-400 mb-6 text-center bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">
            ✨ O cliente será notificado da resolução
        </div>
        <div class="flex gap-3">
            <button id="btn-cancel-resolve-action" class="btn-cancel-resolve flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                ❌ Cancelar
            </button>
            <button id="btn-confirm-resolve-action" class="btn-confirm-resolve flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/50">
                ✅ Sim, Concluir
            </button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmDiv);
    document.body.appendChild(confirmOverlay);
    
    // Promise para aguardar a escolha do usuário
    const userChoice = await new Promise((resolve) => {
        document.getElementById('btn-cancel-resolve-action').onclick = () => {
            confirmOverlay.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                confirmOverlay.remove();
                resolve(false);
            }, 200);
        };
        
        document.getElementById('btn-confirm-resolve-action').onclick = () => {
            confirmOverlay.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                confirmOverlay.remove();
                resolve(true);
            }, 200);
        };
        
        // Fechar ao clicar fora
        confirmOverlay.onclick = (e) => {
            if (e.target === confirmOverlay) {
                confirmOverlay.style.animation = 'fadeIn 0.2s ease-out reverse';
                setTimeout(() => {
                    confirmOverlay.remove();
                    resolve(false);
                }, 200);
            }
        };
    });
    
    if (!userChoice) return;

    setIsResolving(true);
    try {
        // user.name é o nome do agente logado
        const response = await resolveTicket(id, user.name); 
        
        // Atualiza o ticket com o novo status
        setTicket(prev => ({ ...prev, ...response.data })); 
        
        // Adiciona a mensagem de encerramento ao histórico
        if (response.data.closureMessage) {
           setMessages(prev => [...prev, response.data.closureMessage]); 
        }

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
                @keyframes checkmark {
                    0% { transform: scale(0) rotate(-45deg); }
                    50% { transform: scale(1.2) rotate(0deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                .check-animate { animation: checkmark 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
            </style>
            <div class="text-6xl mb-4 check-animate">✅</div>
            <div class="text-2xl font-black mb-2">Chamado Resolvido!</div>
            <div class="text-lg font-semibold mb-1">${response.data.number}</div>
            <div class="text-sm opacity-90 mt-3 flex items-center justify-center gap-2">
                <span>📧</span> Cliente será notificado
            </div>
        `;
        overlay.appendChild(successDiv);
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => overlay.remove(), 300);
        }, 3000);
    } catch (error) {
        console.error('Erro ao resolver chamado:', error);
        const errorMessage = error.response?.data?.message || 'Falha ao concluir o chamado.';
        alert(errorMessage);
    } finally {
        setIsResolving(false);
    }
  };
  
  // 5. Cancelamento do chamado (FUNÇÃO PARA O CLIENTE)
  const handleCancel = async () => {
    // Modal de confirmação customizado
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center';
    confirmOverlay.style.animation = 'fadeIn 0.3s ease-out';
    
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'bg-gradient-to-br from-slate-800 to-slate-900 text-white px-8 py-6 rounded-2xl shadow-2xl border-2 border-red-500/50 max-w-md mx-4';
    confirmDiv.style.animation = 'slideInScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    confirmDiv.innerHTML = `
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInScale {
                0% { transform: scale(0.5) translateY(-50px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            .btn-cancel:hover { transform: scale(1.05); }
            .btn-confirm:hover { transform: scale(1.05); }
        </style>
        <div class="text-5xl mb-4 text-center">⚠️</div>
        <div class="text-2xl font-bold mb-3 text-center">Confirmar Cancelamento</div>
        <div class="text-base text-slate-300 mb-2 text-center">Deseja realmente cancelar o chamado:</div>
        <div class="text-lg font-bold text-red-400 mb-4 text-center">${ticket.number}?</div>
        <div class="text-sm text-slate-400 mb-6 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/30">
            ⚠️ Esta ação não pode ser desfeita!
        </div>
        <div class="flex gap-3">
            <button id="btn-cancel-action" class="btn-cancel flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                ❌ Cancelar
            </button>
            <button id="btn-confirm-action" class="btn-confirm flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/50">
                🗑️ Sim, Cancelar
            </button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmDiv);
    document.body.appendChild(confirmOverlay);
    
    // Promise para aguardar a escolha do usuário
    const userChoice = await new Promise((resolve) => {
        document.getElementById('btn-cancel-action').onclick = () => {
            confirmOverlay.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                confirmOverlay.remove();
                resolve(false);
            }, 200);
        };
        
        document.getElementById('btn-confirm-action').onclick = () => {
            confirmOverlay.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                confirmOverlay.remove();
                resolve(true);
            }, 200);
        };
        
        // Fechar ao clicar fora
        confirmOverlay.onclick = (e) => {
            if (e.target === confirmOverlay) {
                confirmOverlay.style.animation = 'fadeIn 0.2s ease-out reverse';
                setTimeout(() => {
                    confirmOverlay.remove();
                    resolve(false);
                }, 200);
            }
        };
    });
    
    if (!userChoice) return;

    setIsResolving(true);
    try {
        const response = await cancelTicket(id, user.name);
        
        // Notificação de cancelamento suave
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center';
        overlay.style.animation = 'fadeIn 0.3s ease-out';
        
        const cancelDiv = document.createElement('div');
        cancelDiv.className = 'bg-gradient-to-br from-red-500 to-red-600 text-white px-10 py-8 rounded-2xl shadow-2xl border-2 border-red-400 max-w-md mx-4';
        cancelDiv.style.animation = 'slideInScale 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        cancelDiv.innerHTML = `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInScale {
                    0% { transform: scale(0.5) translateY(-50px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .shake-animate { animation: shake 0.5s ease-in-out; }
            </style>
            <div class="text-6xl mb-4 shake-animate">🗑️</div>
            <div class="text-2xl font-black mb-2">Chamado Cancelado</div>
            <div class="text-lg font-semibold mb-3">Sua solicitação foi removida com sucesso</div>
            <div class="flex items-center justify-center gap-2 text-sm opacity-90">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecionando...
            </div>
        `;
        overlay.appendChild(cancelDiv);
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                overlay.remove();
                router.push('/client-dashboard');
            }, 300);
        }, 2500);
    } catch (error) {
        console.error('Erro ao cancelar chamado:', error);
        const errorMessage = error.response?.data?.message || 'Falha ao cancelar o chamado.';
        alert(errorMessage);
    } finally {
        setIsResolving(false);
    }
  };


  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'resolvido': return 'tag-resolved';
      case 'em andamento': return 'tag-in-progress';
      case 'pendente': return 'tag-pending';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBackgroundColor = (role) => {
    return role === 'agent' ? 'bg-blue-100 message-agent' : 'bg-primary-saas message-client';
  }
  
  const getAlignment = (role) => {
    // A mensagem do agente logado fica à direita no chat
    const actualRole = user?.role;
    return role === actualRole ? 'self-end' : 'self-start';
  }

  if (isLoading || !user || !ticket) { 
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-800 text-xl font-bold">Carregando detalhes do chamado...</div>
      </div>
    );
  }
  
  const backUrl = user.role === 'agent' ? '/dashboard' : '/client-dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header do Chat */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-emerald-500/20 shadow-xl p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          
          <Link href={backUrl} className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 mb-2 sm:mb-0 transition-colors">
             ← Voltar ao Painel
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Botão de Conclusão (SÓ APARECE PARA AGENTE E SE NÃO ESTIVER RESOLVIDO) */}
            {user.role === 'agent' && ticket.status !== 'Resolvido' && (
                 <button
                    onClick={handleResolve}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isResolving}
                >
                    {isResolving ? 'Concluindo...' : '✅ Concluir Chamado'}
                </button>
            )}
            
            {/* Botão de Cancelamento (SÓ APARECE PARA CLIENTE E SE NÃO ESTIVER RESOLVIDO) */}
            {user.role === 'client' && ticket.status !== 'Resolvido' && (
                 <button
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isResolving}
                >
                    {isResolving ? 'Cancelando...' : '❌ Cancelar Chamado'}
                </button>
            )}

            <div className="flex flex-col items-end">
              <h1 className="text-xl font-bold text-white">{ticket.number} - {ticket.subject}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col p-4">
        
        {/* Janela do Chat */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 p-6 overflow-y-auto mb-4 flex flex-col space-y-4">
          
          {messages.length === 0 && (
             <div className="text-center py-10 text-slate-400">💬 Inicie a conversa!</div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-xs sm:max-w-md ${getAlignment(msg.senderRole)}`}
            >
              <div 
                className={`p-3 rounded-xl shadow-sm ${getBackgroundColor(msg.senderRole)}`}
              >
                <p className="text-xs font-bold mb-1 opacity-80">
                  {msg.sender} ({msg.senderRole === 'agent' ? 'Agente' : 'Você'})
                </p>
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 self-start ml-2">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Formulário de Envio */}
        <form onSubmit={handleSend} className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/20 p-4 rounded-2xl shadow-2xl flex gap-3 sticky bottom-0 w-full">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={ticket.status === 'Resolvido' ? '⚠️ Chamado resolvido' : '✏️ Digite sua mensagem...'}
            className="flex-1 p-3 bg-slate-900/50 border border-emerald-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
            disabled={isSending || ticket.status === 'Resolvido'}
          />
          <button
            type="submit"
            className={`bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all transform shadow-lg shadow-emerald-500/50 flex items-center justify-center ${
              (newMessage.trim() === '' || isSending || ticket.status === 'Resolvido') ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-emerald-500/70'
            }`}
            disabled={newMessage.trim() === '' || isSending || ticket.status === 'Resolvido'}
          >
            {isSending ? '📤 Enviando...' : '🚀 Enviar'}
          </button>
        </form>
      </main>
    </div>
  );
}