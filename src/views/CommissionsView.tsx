import React, { useState } from "react";
import { commissionService } from "../services/commissionService";
import { type SellerCommission } from "../interfaces/Commission";

const CommissionsView: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sellers, setSellers] = useState<SellerCommission[]>([]);
  const [totalPeriod, setTotalPeriod] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      alert("Por favor, selecione as duas datas para filtrar o período.");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      const data = await commissionService.getCommissionsReport(
        startDate,
        endDate
      );

      setSellers(data.vendedores);
      setTotalPeriod(data.total_commission_period);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-bold" style={{ color: "#0f4c5c" }}>
          Relatório de Comissões
        </h2>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border mb-4">
        <h5 className="fs-6 fw-bold text-muted mb-3">Selecione o Período</h5>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-secondary">
              Data Inicial
            </label>
            <input
              type={startDate ? "date" : "text"} 
              className="form-control"
              placeholder="Período Inicial"
              onFocus={(e) => (e.target.type = "date")} 
              onBlur={(e) => !e.target.value && (e.target.type = "text")}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-secondary">
              Data Final
            </label>
            <input
              type={endDate ? "date" : "text"}
              className="form-control"
              placeholder="Período Final" 
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => !e.target.value && (e.target.type = "text")}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <button
              className="btn text-white w-100 fw-semibold"
              style={{ backgroundColor: "#005f73" }}
              onClick={handleFilter}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-filter me-2"></i>
              )}
              Filtrar Período
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border">
        {!hasSearched ? (
          <p className="text-muted text-center m-0 py-4">
            Selecione uma faixa de datas acima e clique em "Filtrar Período"
            para calcular as comissões.
          </p>
        ) : loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : sellers.length === 0 ? (
          <p className="text-muted text-center m-0 py-4">
            Nenhuma comissão registrada para este período.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light text-secondary fw-semibold">
                <tr>
                  <th
                    scope="col"
                    className="border-0 bg-transparent text-muted py-3"
                  >
                    ID Vendedor
                  </th>
                  <th
                    scope="col"
                    className="border-0 bg-transparent text-muted py-3"
                  >
                    Nome do Vendedor
                  </th>
                  <th
                    scope="col"
                    className="border-0 bg-transparent text-muted py-3 text-center"
                  >
                    Total Vendas
                  </th>
                  <th
                    scope="col"
                    className="border-0 bg-transparent text-muted py-3 text-end"
                  >
                    Comissão a Pagar
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((item) => (
                  <tr key={item.id}>
                    <td className="text-muted py-3">#{item.id}</td>
                    <td className="fw-medium text-dark">{item.name}</td>
                    <td className="text-center">{item.total_vendas}</td>
                    <td className="fw-bold text-dark text-end">
                      {item.total_commission.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                ))}

                <tr className="table-light fw-bold">
                  <td colSpan={3} className="py-3 text-dark fs-5 text-start">
                    Total de Comissões por Período
                  </td>
                  <td
                    className="py-3 text-end fs-5"
                    style={{ color: "#0f4c5c" }}
                  >
                    {totalPeriod.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionsView;
