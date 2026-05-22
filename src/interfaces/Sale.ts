export interface CustomerDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface SellerDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface SaleItem {
  id: number;
  product: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  commission_percentage: string;
  commission_amount: string;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer: number;
  customer_details: CustomerDetails; 
  seller: number;
  seller_details: SellerDetails;     
  total_amount: string;             
  created_at: string;                
  items: SaleItem[];
}