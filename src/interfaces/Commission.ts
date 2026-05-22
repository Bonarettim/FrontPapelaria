export interface SellerCommission {
  id: string | number;
  name: string;
  total_vendas: number;
  total_commission: number;
}

export interface CommissionsResponse {
  vendedores: SellerCommission[];
  total_commission_period: number;
}