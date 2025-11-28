'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const recentTickets = [
    { id: 1, number: '#00123', subject: 'Problema com login', date: '15/11/2024', status: 'Resolvido' },
    { id: 2, number: '#00124', subject: 'Dúvida sobre fatura', date: '16/11/2024', status: 'Em andamento' },
    { id: 3, number: '#00125', subject: 'Solicitação de reembolso', date: '17/11/2024', status: 'Pendente' }
  ];

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleNewTicket = () => {
    alert('Funcionalidade de novo chamado será implementada em breve!');
  };

  const handleSearchTicket = (e) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      alert(`Buscando chamado: ${ticketNumber}`);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'resolvido': return 'status-resolved';
      case 'em andamento': return 'status-in-progress';
      case 'pendente': return 'status-pending';
      default: return 'status-default';
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner">Carregando...</div>
        <style jsx>{`
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          .loading-spinner {
            color: #3498db;
            font-size: 18px;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>SUPORTE FÁCIL</h1>
          <div className="user-info">
            <span>Olá, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Sair</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h1>Bem-vindo(a), {user?.name}!</h1>
          <p className="subtitle">Como podemos ajudá-lo hoje?</p>
          <p className="description">
            Aqui você pode abrir um novo chamado ou consultar o status de um existente.
          </p>
        </div>

        <div className="actions-grid">
          <section className="action-card">
            <h2>Abrir Novo Chamado</h2>
            <div className="divider"></div>
            <button onClick={handleNewTicket} className="action-btn">
              CLIQUE AQUI PARA INICIAR
            </button>
          </section>

          <section className="action-card">
            <h2>Consultar Chamado</h2>
            <div className="divider"></div>
            <form onSubmit={handleSearchTicket} className="search-form">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Digite o número de seu chamado..."
                className="search-input"
              />
              <button type="submit" className="search-btn">Buscar</button>
            </form>
          </section>
        </div>

        <section className="recent-tickets">
          <h2>Chamados Recentes</h2>
          <div className="table-container">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Assunto</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td className="ticket-number">{ticket.number}</td>
                    <td className="ticket-subject">{ticket.subject}</td>
                    <td className="ticket-date">{ticket.date}</td>
                    <td className={`ticket-status ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          font-size: 24px;
          font-weight: 700;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logout-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .welcome-section {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          margin-bottom: 30px;
          text-align: center;
        }

        .welcome-section h1 {
          color: #2c3e50;
          font-size: 32px;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #7f8c8d;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .description {
          color: #95a5a6;
          line-height: 1.6;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .action-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .action-card h2 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 15px;
        }

        .divider {
          height: 2px;
          background: linear-gradient(90deg, #3498db, transparent);
          margin-bottom: 20px;
        }

        .action-btn {
          width: 100%;
          background: #3498db;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .action-btn:hover {
          background: #2980b9;
        }

        .search-form {
          display: flex;
          gap: 10px;
        }

        .search-input {
          flex: 1;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 16px;
        }

        .search-btn {
          background: #2c3e50;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
        }

        .search-btn:hover {
          background: #34495e;
        }

        .recent-tickets {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .recent-tickets h2 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .table-container {
          overflow-x: auto;
        }

        .tickets-table {
          width: 100%;
          border-collapse: collapse;
        }

        .tickets-table th {
          background: #f8f9fa;
          color: #2c3e50;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef;
        }

        .tickets-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          color: #2c3e50;
        }

        .tickets-table tr:hover {
          background: #f8f9fa;
        }

        .ticket-number {
          font-weight: 600;
          color: #3498db;
        }

        .ticket-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          min-width: 100px;
        }

        .status-resolved {
          background: #d4edda;
          color: #155724;
        }

        .status-in-progress {
          background: #fff3cd;
          color: #856404;
        }

        .status-pending {
          background: #f8d7da;
          color: #721c24;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .user-info {
            flex-direction: column;
            gap: 10px;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .search-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}