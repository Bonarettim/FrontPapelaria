import { describe, it, expect } from "vitest";

import type { Product } from "./Product";

describe("Product Interface", () => {
  it("deve criar produto corretamente", () => {
    const product: Product = {
      id: 1,
      code: "P001",
      description: "Notebook",
      unit_price: 3500,
      commission_percentage: 10,
    };

    expect(product.id).toBe(1);

    expect(product.code).toBe("P001");

    expect(product.description).toBe("Notebook");

    expect(product.unit_price).toBe(3500);

    expect(product.commission_percentage).toBe(10);
  });

  it("deve validar valores numéricos", () => {
    const product: Product = {
      id: 2,
      code: "P002",
      description: "Mouse Gamer",
      unit_price: 150,
      commission_percentage: 5,
    };

    expect(product.unit_price).toBeGreaterThan(0);

    expect(product.commission_percentage).toBeGreaterThanOrEqual(0);
  });

  it("deve aceitar comissão zero", () => {
    const product: Product = {
      id: 3,
      code: "P003",
      description: "Teclado",
      unit_price: 250,
      commission_percentage: 0,
    };

    expect(product.commission_percentage).toBe(0);
  });

  it("deve validar descrição do produto", () => {
    const product: Product = {
      id: 4,
      code: "P004",
      description: "Monitor 27 Polegadas",
      unit_price: 1200,
      commission_percentage: 8,
    };

    expect(product.description.length).toBeGreaterThan(3);
  });

  it("deve validar código do produto", () => {
    const product: Product = {
      id: 5,
      code: "ABC123",
      description: "Cadeira Gamer",
      unit_price: 2000,
      commission_percentage: 12,
    };

    expect(product.code).toContain("ABC");
  });
});