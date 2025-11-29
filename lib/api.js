// lib/api.js - Serviço de API com Axios (Simulação)
import axios from 'axios';

// Mock Data
const MOCK_AGENT = { id: 1, name: 'Agente Silva', email: 'agente@suporte.com', role: 'agent' };
const MOCK_CLIENT = { id: 2, name: 'Cliente João', email: 'joao@cliente.com', role: 'client' };

// Statuses que consideramos como chamados 'abertos' (regra de negócio)
const OPEN_STATUSES = ['Em andamento', 'Pendente'];

let nextTicketId = 4; // Começa após os IDs existentes

let MOCK_MESSAGES = [
  { id: 1, ticketId: 1, sender: 'Cliente João', senderRole: 'client', timestamp: '15/11/2024 10:00', text: 'Meu login parou de funcionar do nada. Preciso de ajuda urgente.' },
  { id: 2, ticketId: 1, sender: 'Agente Silva', senderRole: 'agent', timestamp: '15/11/2024 10:15', text: 'Olá João! Recebemos seu chamado #00123. Você consegue me informar se o problema persiste em outro navegador?' },
  { id: 3, ticketId: 2, sender: 'Agente Silva', senderRole: 'agent', timestamp: '16/11/2024 14:00', text: 'Obrigado por nos contatar sobre a fatura. Qual o período em questão?' },
  { id: 4, ticketId: 2, sender: 'Cliente João', senderRole: 'client', timestamp: '16/11/2024 14:30', text: 'É a fatura de Setembro/2024.' },
];

let MOCK_TICKETS = [
  { id: 1, number: '#00123', subject: 'Problema com login', date: '15/11/2024', status: 'Resolvido', clientId: MOCK_CLIENT.id, clientName: MOCK_CLIENT.name, agentName: MOCK_AGENT.name, description: 'Descrição do problema 1' },
  { id: 2, number: '#00124', subject: 'Dúvida sobre fatura', date: '16/11/2024', status: 'Em andamento', clientId: MOCK_CLIENT.id, clientName: MOCK_CLIENT.name, agentName: MOCK_AGENT.name, description: 'Descrição do problema 2' },
  { id: 3, number: '#00125', subject: 'Solicitação de reembolso', date: '17/11/2024', status: 'Pendente', clientId: MOCK_CLIENT.id, clientName: MOCK_CLIENT.name, agentName: 'Não Atribuído', description: 'Descrição do problema 3' }
];

/**
 * 🔑 Simula a chamada API para login usando Axios.
 */
export async function login(username, password) {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (username === 'user' && password === '123') {
    return { data: MOCK_AGENT }; 
  } else if (username === 'cliente' && password === '456') {
    return { data: MOCK_CLIENT };
  } else {
    throw { response: { data: { message: 'Credenciais inválidas.' } } };
  }
}

/**
 * 🎟️ Simula a chamada API para buscar a lista de chamados.
 * Para clientes, retorna um metadado indicando se ele já tem um chamado aberto.
 */
export async function fetchTickets(userId, userRole) {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (userRole === 'client') {
      const userTickets = MOCK_TICKETS.filter(t => t.clientId === userId);
      // Verifica se o cliente tem ALGUM ticket com status 'Em andamento' ou 'Pendente'
      const hasOpenTicket = userTickets.some(t => OPEN_STATUSES.includes(t.status));
      // Retorna a lista de tickets do cliente e a flag de chamado aberto
      return { data: userTickets, meta: { hasOpenTicket } };
  }
  
  // Agente vê todos os chamados
  return { data: MOCK_TICKETS };
}

/**
 * 🚀 Simula a criação de um novo chamado (com validação de limite).
 */
export async function createTicket(user, subject, description) {
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. REGRAS DE NEGÓCIO: Apenas um chamado aberto por cliente
    const clientOpenTickets = MOCK_TICKETS.filter(t => 
        t.clientId === user.id && OPEN_STATUSES.includes(t.status)
    );

    if (clientOpenTickets.length > 0) {
         throw { response: { data: { message: 'Você já possui um chamado em aberto. Por favor, acompanhe o chamado existente.' } } };
    }

    // 2. Cria o novo chamado
    const newTicket = {
        id: nextTicketId++,
        number: `#00${122 + nextTicketId}`, // Garante que o ID é único e sequencial (Ex: #00126, #00127)
        subject: subject,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Pendente',
        clientId: user.id,
        clientName: user.name,
        agentName: 'Não Atribuído',
        description: description
    };
    
    MOCK_TICKETS.push(newTicket);
    
    // 3. Adiciona a mensagem inicial (para iniciar o chat)
    MOCK_MESSAGES.push({
        id: MOCK_MESSAGES.length + 1,
        ticketId: newTicket.id,
        sender: user.name,
        senderRole: 'client',
        timestamp: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: `Abertura de Chamado: ${description.substring(0, 50)}...`
    });

    return { data: newTicket };
}

/**
 * 💬 Simula a chamada API para buscar os detalhes de um chamado, incluindo o histórico de mensagens.
 */
export async function fetchTicketDetails(id) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const ticketId = parseInt(id);
    const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
    
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    
    // Filtra as mensagens associadas a este ticket
    const history = MOCK_MESSAGES.filter(m => m.ticketId === ticketId);
    
    return { data: { ...ticket, history } };
}

/**
 * 📤 Simula o envio de uma nova mensagem no chat.
 */
export async function sendMessage(ticketId, sender, senderRole, text) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Cria um novo objeto de mensagem
    const newMessage = {
        id: MOCK_MESSAGES.length + 1,
        ticketId: parseInt(ticketId),
        sender: sender,
        senderRole: senderRole,
        timestamp: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        text: text
    };
    
    // Adiciona ao mock (para que seja visto imediatamente após o envio)
    MOCK_MESSAGES.push(newMessage);
    
    return { data: newMessage };
}

/**
 * 🔒 Simula a conclusão de um chamado pelo agente.
 * Esta é a nova função solicitada.
 */
export async function resolveTicket(ticketId, agentName) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const id = parseInt(ticketId);
    const ticketIndex = MOCK_TICKETS.findIndex(t => t.id === id);

    if (ticketIndex === -1) {
        throw { response: { data: { message: 'Chamado não encontrado.' } } };
    }

    const ticket = MOCK_TICKETS[ticketIndex];
    if (ticket.status === 'Resolvido') {
         throw { response: { data: { message: 'Chamado já está resolvido.' } } };
    }

    // Atualiza o status
    MOCK_TICKETS[ticketIndex].status = 'Resolvido';
    MOCK_TICKETS[ticketIndex].agentName = agentName; 

    // Adiciona uma mensagem de conclusão ao histórico
    const closureMessage = {
        id: MOCK_MESSAGES.length + 1,
        ticketId: id,
        sender: agentName,
        senderRole: 'agent',
        timestamp: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: 'Chamado concluído e resolvido pelo agente. O suporte foi encerrado.'
    };
    
    MOCK_MESSAGES.push(closureMessage);

    // Retorna o ticket atualizado e a mensagem de encerramento
    return { 
        data: { 
            ...MOCK_TICKETS[ticketIndex], 
            closureMessage: closureMessage 
        } 
    };
}