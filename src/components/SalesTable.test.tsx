import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import SalesTable from "./SalesTable";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("SalesTable", () => {
  const mockOnDelete = vi.fn();

  const mockSetPage = vi.fn();

  const salesMock = [
    {
      id: 1,
      invoice_number: "NF-123",
      created_at: "2025-01-01T10:00:00",
      total_amount: 1000,

      customer_details: {
        name: "Maria",
      },

      seller_details: {
        name: "João",
      },

      items: [
        {
          quantity: 2,
          unit_price: 500,
          subtotal: 1000,
          commission_percentage: 10,
          commission_amount: 100,

          product_details: {
            description: "Notebook",
          },
        },
      ],
    },
  ];

  it("deve renderizar tabela de vendas", () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    expect(screen.getByText("NF-123")).toBeInTheDocument();

    expect(screen.getByText("Maria")).toBeInTheDocument();

    expect(screen.getByText("João")).toBeInTheDocument();
  });

  it("deve mostrar mensagem quando não houver vendas", () => {
    render(
      <SalesTable
        sales={[]}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={false}
        hasPreviousPage={false}
      />
    );

    expect(
      screen.getByText("Nenhuma venda encontrada.")
    ).toBeInTheDocument();
  });

  it("deve expandir os itens da venda", async () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    await userEvent.click(screen.getByText("Ver itens"));

    expect(screen.getByText("Notebook")).toBeInTheDocument();

    expect(screen.getByText("Preço unitário")).toBeInTheDocument();

    expect(screen.getByText("% de Comissão")).toBeInTheDocument();
  });

  it("deve fechar os itens da venda", async () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    await userEvent.click(screen.getByText("Ver itens"));

    expect(screen.getByText("Notebook")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Fechar"));

    expect(
      screen.queryByText("Preço unitário")
    ).not.toBeInTheDocument();
  });

  it("deve chamar onDelete ao clicar em excluir", async () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    const deleteButtons = document.querySelectorAll(".bi-trash");

    await userEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("deve navegar para edição", async () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    const editButtons = document.querySelectorAll(".bi-pencil-square");

    await userEvent.click(editButtons[0]);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/vendas/editar/1"
    );
  });

  it("deve ir para próxima página", async () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    await userEvent.click(screen.getByText("Próxima"));

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("deve voltar para página anterior", async () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={2}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    await userEvent.click(screen.getByText("Anterior"));

    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("deve desabilitar botão anterior", () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    expect(screen.getByText("Anterior")).toBeDisabled();
  });

  it("deve desabilitar botão próxima", () => {
    render(
      <SalesTable
        sales={salesMock}
        onDelete={mockOnDelete}
        page={1}
        setPage={mockSetPage}
        hasNextPage={false}
        hasPreviousPage={true}
      />
    );

    expect(screen.getByText("Próxima")).toBeDisabled();
  });
});