import React, { useState, useEffect } from "react";
import SalesTable from "../components/SalesTable";
import { type Sale } from "../interfaces/Sale";
import { deleteSale, getSales } from "../services/salesService";
import { useNavigate } from "react-router-dom";

const SalesView: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      setLoading(true);

      const response = await getSales(page);

      setSales(response.data.results || []);

      setHasNextPage(!!response.data.next);
      setHasPreviousPage(!!response.data.previous);
    } catch (error) {
      console.error("Erro ao buscar as vendas:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  const handleDeleteSale = async (saleId: number | string) => {
    const confirmed = window.confirm("Deseja realmente excluir esta venda?");
    if (!confirmed) return;

    try {
      await deleteSale(saleId);
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
    } catch (error) {
      console.error("Erro ao excluir venda", error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-bold" style={{ color: "#0f4c5c" }}>
          Vendas Realizadas
        </h2>
        <button
          className="btn text-white px-4 py-2 fw-semibold shadow-sm"
          style={{ backgroundColor: "#005f73" }}
          onClick={() => navigate("/vendas/nova")}
        >
          Inserir nova Venda
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <SalesTable
            sales={sales}
            onDelete={handleDeleteSale}
            page={page}
            setPage={setPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        )}
      </div>

      {selectedSale && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Itens da Venda #{selectedSale.id}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedSale(null)}
                ></button>
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
