// app/ticket/[id]/page.js - Tela de Chat Compartilhada (Com botão de Concluir)
'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
// Importa a nova função resolveTicket
import { fetchTicketDetails, sendMessage, resolveTicket } from '@/lib/api'; 

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
    if (!window.confirm(`Tem certeza que deseja CONCLUIR e RESOLVER o chamado ${ticket.number}?`)) {
        return;
    }

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

        alert(`Chamado ${response.data.number} resolvido com sucesso!`);
    } catch (error) {
        console.error('Erro ao resolver chamado:', error);
        const errorMessage = error.response?.data?.message || 'Falha ao concluir o chamado.';
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Header do Chat */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          
          <Link href={backUrl} className="text-gray-600 hover:text-secondary-saas font-semibold flex items-center mb-2 sm:mb-0">
             ← Voltar ao Painel
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Botão de Conclusão (SÓ APARECE PARA AGENTE E SE NÃO ESTIVER RESOLVIDO) */}
            {user.role === 'agent' && ticket.status !== 'Resolvido' && (
                 <button
                    onClick={handleResolve}
                    className="bg-primary-saas hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isResolving}
                >
                    {isResolving ? 'Concluindo...' : '✅ Concluir Chamado'}
                </button>
            )}

            <div className="flex flex-col items-end">
              <h1 className="text-xl font-bold text-secondary-saas">{ticket.number} - {ticket.subject}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase mt-1 ${getStatusClass(ticket.status)}`}>
                  Status: {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col p-4">
        
        {/* Janela do Chat */}
        <div className="flex-1 bg-white rounded-xl shadow-xl p-4 overflow-y-auto mb-4 flex flex-col space-y-4">
          
          {messages.length === 0 && (
             <div className="text-center py-10 text-gray-500">Inicie a conversa!</div>
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
        <form onSubmit={handleSend} className="bg-white p-4 rounded-xl shadow-xl flex gap-3 sticky bottom-0 w-full">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={ticket.status === 'Resolvido' ? 'Chamado resolvido. Não é possível enviar mais mensagens.' : 'Digite sua mensagem aqui...'}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saas"
            disabled={isSending || ticket.status === 'Resolvido'}
          />
          <button
            type="submit"
            className={`bg-primary-saas hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg transition shadow-md flex items-center justify-center ${
              (newMessage.trim() === '' || isSending || ticket.status === 'Resolvido') ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={newMessage.trim() === '' || isSending || ticket.status === 'Resolvido'}
          >
            {isSending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </main>
    </div>
  );
}