import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose(); 
  };

  // Funções auxiliares para evitar aquele código gigante dentro da Template String
  const isVendasActive = location.pathname === '/vendas' || location.pathname === '/';
  const isComissoesActive = location.pathname === '/comissoes';

  return (
    <>
      <div 
        className="bg-white border-end h-100 position-fixed start-0 top-0 shadow-sm" 
        style={{ 
          width: '260px', 
          zIndex: 1050,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          paddingTop: '20px'
        }}
      >
        <div className="d-flex justify-content-between align-items-center px-4 mb-4">
          <button className="btn-close d-md-none" type="button" onClick={onClose}></button>
        </div>

        <div className="px-3">
          <ul className="nav nav-pills flex-column gap-2">
            
            <li className="nav-item">
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center justify-content-between py-2 px-3 fw-semibold border-0 rounded ${
                  isVendasActive ? 'bg-light text-dark shadow-sm' : 'text-secondary bg-transparent'
                }`}
                onClick={() => handleMenuClick('/vendas')}
                style={{ transition: 'all 0.2s' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi bi-coin fs-5 ${isVendasActive ? 'text-success' : 'text-muted'}`}></i>
                  <span>Vendas</span>
                </div>
                <span className="text-muted small">›</span>
              </button>
            </li>
            
            <li className="nav-item">
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center justify-content-between py-2 px-3 fw-semibold border-0 rounded ${
                  isComissoesActive ? 'bg-light text-dark shadow-sm' : 'text-secondary bg-transparent'
                }`}
                onClick={() => handleMenuClick('/comissoes')}
                style={{ transition: 'all 0.2s' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi bi-calculator fs-5 ${isComissoesActive ? 'text-success' : 'text-muted'}`}></i>
                  <span>Comissões</span>
                </div>
                <span className="text-muted small">›</span>
              </button>
            </li>

          </ul>
        </div>
      </div>

      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none" 
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040 }}
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;