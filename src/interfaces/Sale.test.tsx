import { describe, it, expect } from "vitest";

import type {
  CustomerDetails,
  SellerDetails,
  SaleItem,
  Sale,
} from "./Sale";

describe("Sale Interfaces", () => {
  it("deve criar CustomerDetails corretamente", () => {
    const customer: CustomerDetails = {
      id: 1,
      name: "Maria",
      email: "maria@email.com",
      phone: "11999999999",
    };

    expect(customer.id).toBe(1);

    expect(customer.name).toBe("Maria");

    expect(customer.email).toContain("@");

    expect(customer.phone.length).toBeGreaterThan(8);
  });

  it("deve criar SellerDetails corretamente", () => {
    const seller: SellerDetails = {
      id: 2,
      name: "João",
      email: "joao@email.com",
      phone: "11888888888",
    };

    expect(seller.id).toBe(2);

    expect(seller.name).toBe("João");

    expect(seller.email).toContain("@");

    expect(seller.phone.length).toBeGreaterThan(8);
  });

  it("deve criar SaleItem corretamente", () => {
    const item: SaleItem = {
      id: 1,
      product: 10,
      quantity: 2,
      unit_price: "500.00",
      subtotal: "1000.00",
      commission_percentage: "10.00",
      commission_amount: "100.00",
    };

    expect(item.id).toBe(1);

    expect(item.product).toBe(10);

    expect(item.quantity).toBe(2);

    expect(item.unit_price).toBe("500.00");

    expect(item.subtotal).toBe("1000.00");

    expect(item.commission_percentage).toBe("10.00");

    expect(item.commission_amount).toBe("100.00");
  });

  it("deve validar quantidade do item", () => {
    const item: SaleItem = {
      id: 2,
      product: 20,
      quantity: 5,
      unit_price: "100.00",
      subtotal: "500.00",
      commission_percentage: "5.00",
      commission_amount: "25.00",
    };

    expect(item.quantity).toBeGreaterThan(0);
  });

  it("deve criar Sale corretamente", () => {
    const sale: Sale = {
      id: 1,
      invoice_number: "NF-123",

      customer: 1,

      customer_details: {
        id: 1,
        name: "Maria",
        email: "maria@email.com",
        phone: "11999999999",
      },

      seller: 2,

      seller_details: {
        id: 2,
        name: "João",
        email: "joao@email.com",
        phone: "11888888888",
      },

      total_amount: "1000.00",

      created_at: "2025-01-01T10:00:00",

      items: [
        {
          id: 1,
          product: 10,
          quantity: 2,
          unit_price: "500.00",
          subtotal: "1000.00",
          commission_percentage: "10.00",
          commission_amount: "100.00",
        },
      ],
    };

    expect(sale.id).toBe(1);

    expect(sale.invoice_number).toBe("NF-123");

    expect(sale.customer_details.name).toBe("Maria");

    expect(sale.seller_details.name).toBe("João");

    expect(sale.total_amount).toBe("1000.00");

    expect(sale.items.length).toBe(1);
  });

  it("deve validar dados do item da venda", () => {
    const sale: Sale = {
      id: 2,
      invoice_number: "NF-999",

      customer: 1,

      customer_details: {
        id: 1,
        name: "Carlos",
        email: "carlos@email.com",
        phone: "11977777777",
      },

      seller: 2,

      seller_details: {
        id: 2,
        name: "Fernanda",
        email: "fernanda@email.com",
        phone: "11966666666",
      },

      total_amount: "2500.00",

      created_at: "2025-02-01T15:00:00",

      items: [
        {
          id: 1,
          product: 100,
          quantity: 5,
          unit_price: "500.00",
          subtotal: "2500.00",
          commission_percentage: "12.00",
          commission_amount: "300.00",
        },
      ],
    };

    const item = sale.items[0];

    expect(item.quantity).toBe(5);

    expect(item.subtotal).toBe("2500.00");

    expect(item.commission_amount).toBe("300.00");
  });

  it("deve aceitar lista vazia de itens", () => {
    const sale: Sale = {
      id: 3,
      invoice_number: "NF-EMPTY",

      customer: 1,

      customer_details: {
        id: 1,
        name: "Teste",
        email: "teste@email.com",
        phone: "11900000000",
      },

      seller: 2,

      seller_details: {
        id: 2,
        name: "Vendedor",
        email: "vendedor@email.com",
        phone: "11800000000",
      },

      total_amount: "0.00",

      created_at: "2025-03-01T10:00:00",

      items: [],
    };

    expect(sale.items).toEqual([]);
  });
});