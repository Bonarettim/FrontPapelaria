import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type Mock,
} from "vitest";

import SalesView from "./SalesView";

import * as salesService from "../services/salesService";

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

vi.mock("../services/salesService");

vi.mock("../components/SalesTable", () => ({
  default: ({
    sales,
    onDelete,
    setPage,
  }: {
    sales: any[];
    onDelete: (id: number) => void;
    setPage: (page: number) => void;
  }) => (
    <div>
      <div>SalesTable Mock</div>

      <button onClick={() => onDelete(1)}>
        Excluir Venda
      </button>

      <button onClick={() => setPage(2)}>
        Próxima Página
      </button>

      {sales.map((sale) => (
        <div key={sale.id}>
          {sale.customer_details.name}
        </div>
      ))}
    </div>
  ),
}));

describe("SalesView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar título da página", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    expect(
      screen.getByText("Vendas Realizadas")
    ).toBeInTheDocument();
  });

  it("deve renderizar botão de nova venda", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    expect(
      screen.getByText("Inserir nova Venda")
    ).toBeInTheDocument();
  });

  it("deve navegar para nova venda", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    await userEvent.click(
      screen.getByText("Inserir nova Venda")
    );

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/vendas/nova"
    );
  });

  it("deve buscar vendas ao carregar", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    await waitFor(() => {
      expect(salesService.getSales).toHaveBeenCalledWith(1);
    });
  });

  it("deve renderizar SalesTable", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    expect(
      await screen.findByText("SalesTable Mock")
    ).toBeInTheDocument();
  });

  it("deve renderizar vendas recebidas", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [
          {
            id: 1,
            customer_details: {
              name: "Maria",
            },
          },
        ],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    expect(
      await screen.findByText("Maria")
    ).toBeInTheDocument();
  });

  it("deve excluir venda", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [
          {
            id: 1,
            customer_details: {
              name: "Maria",
            },
          },
        ],
        next: null,
        previous: null,
      },
    });

    (salesService.deleteSale as Mock).mockResolvedValue({});

    render(<SalesView />);

    await screen.findByText("Maria");

    await userEvent.click(
      screen.getByText("Excluir Venda")
    );

    await waitFor(() => {
      expect(salesService.deleteSale).toHaveBeenCalledWith(1);
    });
  });

  it("não deve excluir venda se usuário cancelar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [
          {
            id: 1,
            customer_details: {
              name: "Maria",
            },
          },
        ],
        next: null,
        previous: null,
      },
    });

    render(<SalesView />);

    await screen.findByText("Maria");

    await userEvent.click(
      screen.getByText("Excluir Venda")
    );

    expect(salesService.deleteSale).not.toHaveBeenCalled();
  });

  it("deve mudar página", async () => {
    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [],
        next: "next-page",
        previous: null,
      },
    });

    render(<SalesView />);

    await screen.findByText("Próxima Página");

    await userEvent.click(
      screen.getByText("Próxima Página")
    );

    await waitFor(() => {
      expect(salesService.getSales).toHaveBeenCalledWith(2);
    });
  });

  it("deve mostrar loading inicialmente", () => {
    (salesService.getSales as Mock).mockImplementation(
      () =>
        new Promise(() => {
          // loading infinito
        })
    );

    render(<SalesView />);

    const spinner = document.querySelector(
      ".spinner-border"
    );

    expect(spinner).toBeInTheDocument();
  });

  it("deve tratar erro ao buscar vendas", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (salesService.getSales as Mock).mockRejectedValue(
      new Error("Erro API")
    );

    render(<SalesView />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  it("deve tratar erro ao excluir venda", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (salesService.getSales as Mock).mockResolvedValue({
      data: {
        results: [
          {
            id: 1,
            customer_details: {
              name: "Maria",
            },
          },
        ],
        next: null,
        previous: null,
      },
    });

    (salesService.deleteSale as Mock).mockRejectedValue(
      new Error("Erro ao excluir")
    );

    render(<SalesView />);

    await screen.findByText("Maria");

    await userEvent.click(
      screen.getByText("Excluir Venda")
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});