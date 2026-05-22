import React, { useState, useEffect } from 'react';
import SalesTable from '../components/SalesTable';
import api from '../services/api';
import { type Sale } from '../interfaces/Sale';

const SalesView: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get<Sale[]>('/sales/'); 
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao buscar as vendas do backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-bold" style={{ color: '#0f4c5c' }}>
          Vendas Realizadas
        </h2>
        <button className="btn text-white px-4 py-2 fw-semibold shadow-sm" style={{ backgroundColor: '#005f73' }}>
          Inserir nova Venda
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border">
        {loading ? (
          <div className="text-center my-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <SalesTable 
            sales={sales} 
          />
        )}
      </div>

      {selectedSale && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Itens da Venda #{selectedSale.id}</h5>
                <button className="btn-close" onClick={() => setSelectedSale(null)}></button>
              </div>
              <div className="modal-body">
                <p>Detalhes dos produtos virão aqui...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesView;