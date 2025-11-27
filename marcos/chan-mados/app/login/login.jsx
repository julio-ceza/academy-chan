import React, { useState } from 'react';
import './Login.css'; // Arquivo CSS separado

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log('Login attempt:', { username, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="logo">ACDC</h1>
          <h2 className="subtitle">LOGIN</h2>
          <p className="instruction">Entre com suas credenciais para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Lembrar-me</label>
          </div>
          
          <button type="submit" className="login-btn">ENTRAR</button>
          
          <div className="forgot-password">
            <a href="/forgot-password">Esqueci minha senha</a>
          </div>
        </form>
        
        <div className="login-footer">
          <p>&copy; 2025 Sua Empresa. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;