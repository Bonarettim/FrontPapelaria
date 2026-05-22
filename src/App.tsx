import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SalesView from './views/SalesView';
import CommissionsView from './views/CommissionsView';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div className="d-flex bg-light min-vh-100">
        {/* Sidebar fixa que escuta as rotas globais */}
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <div className="flex-grow-1 d-flex flex-column" style={{ paddingTop: '70px' }}>
          <Navbar onToggleMenu={() => setIsMenuOpen(true)} />

          <main className="p-4 flex-grow-1">
            {/* Definição das Rotas do Browser */}
            <Routes>
              {/* Redireciona a rota raiz direto para /vendas */}
              <Route path="/" element={<Navigate to="/vendas" replace />} />
              
              {/* Renderiza as respectivas Views com base na URL do browser */}
              <Route path="/vendas" element={<SalesView />} />
              <Route path="/comissoes" element={<CommissionsView />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;