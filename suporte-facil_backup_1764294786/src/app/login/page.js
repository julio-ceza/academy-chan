'use client';

import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.username.trim() || !formData.password.trim()) {
      alert('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login attempt:', formData);
      alert(`Bem-vindo, ${formData.username}!`);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <h1>SUPORTE FÁCIL</h1>
        </div>
        
        {/* Cabeçalho */}
        <div className={styles.loginHeader}>
          <h2>ACESSO DO AGENTE</h2>
          <p>Entre com suas credenciais para continuar</p>
        </div>
        
        {/* Formulário */}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>
              <span className={styles.checkboxPlaceholder}></span>
              Nome de Usuário
            </label>
            <input 
              type="text"
              name="username"
              placeholder="Digite seu nome de usuário"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>
              <span className={styles.checkboxPlaceholder}></span>
              Senha
            </label>
            <input 
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'CARREGANDO...' : 'ENTRAR'}
          </button>
        </form>
        
        {/* Link Esqueci Senha */}
        <div className={styles.forgotPassword}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Esqueci minha senha
          </a>
        </div>
        
        {/* Rodapé */}
        <div className={styles.footer}>
          <p>&copy; 2024 Sua Empresa. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
