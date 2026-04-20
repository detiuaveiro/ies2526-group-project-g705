import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para armazenar os dados dos teus sensores/entidades
  const [items, setItems] = useState([]);

  // Hook para carregar dados do Spring Boot assim que o componente monta
  useEffect(() => {
    fetch('http://localhost:8080/api/os-teus-dados') 
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Erro na API:", err));
  }, []);

  return (
    <div className="App">
      {/* Aqui colas o HTML que exportaste do Figma */}
      {/* REGRAS: class vira className | tags como <img /> têm de fechar */}
      <h1>O Teu Projeto IES</h1>
      
      <div className="dashboard">
        {items.map(item => (
          <div key={item.id} className="card">
            {item.nome}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;