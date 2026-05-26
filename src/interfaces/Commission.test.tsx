import { describe, it, expect } from "vitest";

import type {
  SellerCommission,
  CommissionsResponse,
} from "./Commission";

describe("Commission Interfaces", () => {
  it("deve criar SellerCommission corretamente", () => {
    const seller: SellerCommission = {
      id: 1,
      name: "João",
      total_vendas: 10,
      total_commission: 500,
    };

    expect(seller.id).toBe(1);

    expect(seller.name).toBe("João");

    expect(seller.total_vendas).toBe(10);

    expect(seller.total_commission).toBe(500);
  });

  it("deve aceitar id string", () => {
    const seller: SellerCommission = {
      id: "abc123",
      name: "Maria",
      total_vendas: 5,
      total_commission: 250,
    };

    expect(seller.id).toBe("abc123");
  });

  it("deve criar CommissionsResponse corretamente", () => {
    const response: CommissionsResponse = {
      vendedores: [
        {
          id: 1,
          name: "João",
          total_vendas: 10,
          total_commission: 500,
        },
        {
          id: 2,
          name: "Maria",
          total_vendas: 5,
          total_commission: 250,
        },
      ],

      total_commission_period: 750,
    };

    expect(response.vendedores.length).toBe(2);

    expect(response.total_commission_period).toBe(750);
  });

  it("deve validar valores dos vendedores", () => {
    const response: CommissionsResponse = {
      vendedores: [
        {
          id: 1,
          name: "Carlos",
          total_vendas: 20,
          total_commission: 1000,
        },
      ],

      total_commission_period: 1000,
    };

    const seller = response.vendedores[0];

    expect(seller.name).toBe("Carlos");

    expect(seller.total_vendas).toBeGreaterThan(0);

    expect(seller.total_commission).toBeGreaterThan(0);
  });

  it("deve aceitar lista vazia de vendedores", () => {
    const response: CommissionsResponse = {
      vendedores: [],
      total_commission_period: 0,
    };

    expect(response.vendedores).toEqual([]);

    expect(response.total_commission_period).toBe(0);
  });
});