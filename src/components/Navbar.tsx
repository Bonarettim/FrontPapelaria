import React from 'react';
import logoImg from '../assets/logoImg.png'; 

interface NavbarProps {
  onToggleMenu: () => void;
}

const getPageTitle = () => {
  if (location.pathname === '/comissoes') {
    return 'Comissões';
  }
  return 'Vendas'; 
};

const Navbar: React.FC<NavbarProps> = ({ onToggleMenu }) => {
  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 py-2 fixed-top w-100 shadow-sm" style={{ height: '70px' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn p-0 border-0 fs-3 d-flex align-items-center justify-content-center text-dark" 
            type="button"
            style={{ cursor: 'pointer', lineHeight: '1' }}
            onClick={onToggleMenu} 
          >
            <i className="bi bi-list"></i>
          </button>
          <img 
            src={logoImg} 
            alt="Logo Papelaria" 
            style={{ height: '50px', objectFit: 'contain' }} 
          />
         
        </div>

        <div className="position-absolute start-50 translate-middle-x">
        <span className="fs-4 fw-bold" style={{ color: '#0f4c5c' }}>
          {getPageTitle()}
          </span>
          
        </div>

        <div style={{ width: '100px' }} className="d-none d-md-block"></div>

      </div>
    </nav>
  );
};

export default Navbar;