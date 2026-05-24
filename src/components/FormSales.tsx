import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as salesService from "../services/salesService";
import { saleSchema } from "../schema/SaleSchema"; 
import toast from "react-hot-toast";

const FormularioVenda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [sellers, setSellers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    seller_id: "",
    customer_id: "",
    sale_date: new Date().toISOString().slice(0, 16),
    items: [] as any[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellersRes, customersRes, productsRes] = await Promise.all([
          salesService.getSellers(),
          salesService.getCustomers(),
          salesService.getProducts(),
        ]);

        setSellers(sellersRes.data);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);

        if (isEditing && id) {
          const saleRes = await salesService.getSaleById(id);
          setFormData({
            seller_id: String(saleRes.data.seller),
            customer_id: String(saleRes.data.customer),
            sale_date: saleRes.data.created_at?.slice(0, 16),
            items: saleRes.data.items || [],
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = saleSchema.safeParse({
      seller_id: formData.seller_id,
      customer_id: formData.customer_id,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};
      Object.keys(fieldErrors).forEach((key) => {
        formattedErrors[key] = fieldErrors[key]![0];
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      const payload = {
        seller: Number(formData.seller_id),
        customer: Number(formData.customer_id),
        invoice_number: `NF-${Date.now()}`,
        created_at: formData.sale_date,
        items: formData.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };
  
      if (!isEditing && !id) {
        await salesService.createSale(payload);
        toast.success("Venda realizada com sucesso!"); 
      } else {
        await salesService.updateSale(id, payload);
        toast.success("Venda atualizada com sucesso!"); 
      }
      navigate("/vendas");
    } catch (error: any) {
      if (error.response && error.data) {
        console.error("Detalhes do erro do servidor:", error.response.data);
      }
      toast.error("Erro ao salvar: verifique os campos.");
      console.error("Erro ao salvar venda", error);
    }

    setErrors({});

  };

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === Number(selectedProductId));

    if (!product) return;

    const newItem = {
      product: product.id,
      quantity,
      product_details: product,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const totalVenda = formData.items.reduce((acc, item) => {
    const price = Number(item.product_details?.unit_price || 0);

    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="container-fluid py-4">
      <div className="card shadow border-0">
        <div className="card-header bg-white text-center py-4">
          <h1 className="fw-bold" style={{ color: "#0f6b6f" }}>
            {isEditing ? "Editar Venda" : "Nova Venda"}
          </h1>
        </div>

        <div className="card-body p-5">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-7 border-end pe-5">
                <h2 className="mb-4">Produtos</h2>

                <div className="row g-3 align-items-end">
                  <div className="col-md-7">
                    <label className="form-label">Produto</label>

                    <select
                      className="form-select"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">Selecione um produto</option>

                      {products
                        .filter((product: any) => {
                          const alreadyAdded = formData.items.some(
                            (item: any) => item.product === product.id
                          );

                          return !alreadyAdded;
                        })

                        .map((product: any) => (
                          <option key={product.id} value={product.id}>
                            {product.description}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Quantidade</label>

                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>

                  {/* BTN */}
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={handleAddItem}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <hr className="my-4" />

                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Produto</th>

                      <th>Qtd</th>

                      <th>Preço Unitário</th>

                      <th>Total</th>

                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {formData.items.map((item: any, idx) => {
                      const total =
                        Number(item.product_details?.unit_price || 0) *
                        item.quantity;

                      return (
                        <tr key={idx}>
                          <td>{item.product_details?.description}</td>

                          <td>{item.quantity}</td>

                          <td>R$ {item.product_details?.unit_price}</td>

                          <td>R$ {total.toFixed(2)}</td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveItem(idx)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="col-lg-5 ps-5">
                <h2 className="mb-4">Dados da venda</h2>

                <div className="mb-4">
                  <label className="form-label">Data e Hora</label>

                  <input
                    disabled
                    type="datetime-local"
                    className="form-control"
                    value={formData.sale_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Vendedor</label>
                  <select
                    className={`form-select ${
                      errors.seller_id ? "is-invalid" : ""
                    }`}
                    value={formData.seller_id}
                    onChange={(e) => {
                      setFormData({ ...formData, seller_id: e.target.value });
                      if (errors.seller_id)
                        setErrors({ ...errors, seller_id: "" });
                    }}
                  >
                    <option value="">Selecione...</option>
                    {sellers.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {errors.seller_id && (
                    <small className="text-danger">{errors.seller_id}</small>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Cliente</label>

                  <select
                    className={`form-select ${
                      errors.customer_id ? "is-invalid" : ""
                    }`}
                    value={formData.customer_id}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        customer_id: e.target.value,
                      });
                      if (errors.customer_id) {
                        setErrors({ ...errors, customer_id: "" });
                      }
                    }}
                  >
                    <option value="">Selecione...</option>
                    {customers.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {errors.customer_id && (
                    <div className="text-danger mt-1 small">
                      {errors.customer_id}
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="fw-bold">Total: R$ {totalVenda.toFixed(2)}</h3>
                </div>

                <div className="d-flex justify-content-between mt-5">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/vendas")}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn btn-success px-5">
                    {isEditing ? "Salvar" : "Finalizar"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioVenda;
