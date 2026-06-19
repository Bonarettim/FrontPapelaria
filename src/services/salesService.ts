import api from "./api";

export const deleteSale = async (saleId: number | string) => {
  await api.delete(`/sales/${saleId}/`);
};


export const getSaleById = (id: string) => api.get(`/sales/${id}/`);
export const createSale = (data: any) => api.post('/sales/', data);
export const updateSale = (id: string, data: any) => api.put(`/sales/${id}/`, data);

export const getSellers = () => api.get('/sellers/');
export const getCustomers = () => api.get('/customers/');
export const getProducts = () => api.get('/products/');


export const getSales = (page: number = 1, search: string = "") => {
  return api.get("/sales/", {
    params: {
      page,
      search,
    },
  });
};