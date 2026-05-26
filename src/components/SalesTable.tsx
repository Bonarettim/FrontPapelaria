import React, { useState } from "react";
import { type Sale } from "../interfaces/Sale";
import { useNavigate } from "react-router-dom";

interface SalesTableProps {
  sales: Sale[];
  onDelete: (saleId: number | string) => void;
  page: number;
  setPage: (p: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales = [],
  onDelete,
  page,
  setPage,
  hasNextPage,
  hasPreviousPage,
}) => {
  const [expandedSaleId, setExpandedSaleId] = useState<string | number | null>(
    null
  );
  const navigate = useNavigate();

  const toggleExpand = (id: string | number) => {
    setExpandedSaleId(expandedSaleId === id ? null : id);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle m-0">
        <thead className="table-light text-secondary fw-semibold">
          <tr>
            <th className="border-0 bg-transparent text-muted py-3">
              Nota Fiscal
            </th>
            <th className="border-0 bg-transparent text-muted py-3">Cliente</th>
            <th className="border-0 bg-transparent text-muted py-3">
              Vendedor
            </th>
            <th className="border-0 bg-transparent text-muted py-3">
              Data da Venda
            </th>
            <th className="border-0 bg-transparent text-muted py-3">
              Valor Total
            </th>
            <th className="border-0 bg-transparent text-center text-muted py-3">
              Opções
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-5">
                Nenhuma venda encontrada.
              </td>
            </tr>
          ) : (
            sales.map((sale) => {
              const id = sale.id ?? sale.invoice_number;
              const isExpanded = expandedSaleId === id;

              return (
                <React.Fragment key={id}>
                  <tr>
                    <td className="text-muted py-3">{sale.invoice_number}</td>
                    <td className="fw-medium text-dark">
                      {sale.customer_details?.name}
                    </td>
                    <td>{sale.seller_details?.name}</td>
                    <td>
                      {sale.created_at
                        ? new Date(sale.created_at)
                            .toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            .replace(", ", " - ")
                        : "-"}
                    </td>
                    <td className="fw-bold text-dark">
                      {Number(sale.total_amount ?? 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-link btn-sm text-decoration-none fw-semibold"
                        style={{ color: "#005f73" }}
                        onClick={() => toggleExpand(id)}
                      >
                        {isExpanded ? "Fechar" : "Ver itens"}
                      </button>
                      <button
                        onClick={() => navigate(`/vendas/editar/${sale.id}`)}
                        className="btn btn-link p-0 mx-2 text-dark border-0 fs-5"
                      >
                        <i className="bi bi-pencil-square text-secondary"></i>
                      </button>
                      <button
                        className="btn btn-link p-0 text-danger border-0 fs-5"
                        onClick={() => onDelete(id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="table-light">
                      <td colSpan={6} className="p-3">
                        <div className="bg-white p-3 rounded border shadow-sm">
                          <table className="table table-sm m-0">
                            <thead>
                              <tr className="text-muted small">
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço unitário</th>
                                <th>Total do Produto</th>
                                <th>% de Comissão </th>
                                <th>Comissão</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sale.items?.map((item: any, idx: number) => (
                                <tr key={idx}>
                                  <td>{item.product_details?.description}</td>
                                  <td>{item.quantity}</td>
                                  <td>
                                    R$ {Number(item.unit_price).toFixed(2)}
                                  </td>
                                  <td>R$ {Number(item.subtotal).toFixed(2)}</td>
                                  <td>
                                    {Number(item.commission_percentage).toFixed(
                                      2
                                    )}
                                    %
                                  </td>
                                  <td>
                                    R${" "}
                                    {Number(item.commission_amount).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot
                              className="fw-bold"
                              style={{ color: "#0f4c5c" }}
                            >
                              <tr>
                                <td style={{ color: "#005f73" }}>
                                  Total da Venda
                                </td>
                                <td style={{ color: "#005f73" }}>
                                  {sale.items?.reduce(
                                    (acc, item) => acc + item.quantity,
                                    0
                                  )}
                                </td>
                                <td></td>
                                <td style={{ color: "#005f73" }}>
                                  R$ {Number(sale.total_amount).toFixed(2)}
                                </td>
                                <td></td>
                                <td style={{ color: "#005f73" }}>
                                  R${" "}
                                  {sale.items
                                    ?.reduce(
                                      (acc, item) =>
                                        acc + Number(item.commission_amount),
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
        <button
          className="btn btn-sm btn-outline-secondary px-3"
          onClick={() => setPage(page - 1)}
          disabled={!hasPreviousPage}
        >
          Anterior
        </button>
        <span className="text-muted small fw-semibold">Página {page}</span>
        <button
          className="btn btn-sm btn-outline-secondary px-3"
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default SalesTable;
