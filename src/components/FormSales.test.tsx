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

import FormularioVenda from "./FormSales";

import * as salesService from "../services/salesService";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useParams: () => ({}),
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../services/salesService");

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("FormularioVenda", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (salesService.getSellers as Mock).mockResolvedValue({
      data: [{ id: 1, name: "João" }],
    });

    (salesService.getCustomers as Mock).mockResolvedValue({
      data: [{ id: 1, name: "Maria" }],
    });

    (salesService.getProducts as Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          description: "Notebook",
          unit_price: 1000,
        },
      ],
    });
  });

  it("deve renderizar o formulário", async () => {
    render(<FormularioVenda />);

    expect(await screen.findByText("Nova Venda")).toBeInTheDocument();

    expect(screen.getByText("Produtos")).toBeInTheDocument();

    expect(screen.getByText("Dados da venda")).toBeInTheDocument();
  });

  it("deve adicionar produto", async () => {
    render(<FormularioVenda />);

    const selects = await screen.findAllByRole("combobox");

    const productSelect = selects[0];

    await userEvent.selectOptions(productSelect, "1");

    await userEvent.click(screen.getByText("Adicionar"));

    expect(screen.getByText("Notebook")).toBeInTheDocument();
  });

  it("deve remover produto", async () => {
    render(<FormularioVenda />);

    const selects = await screen.findAllByRole("combobox");

    const productSelect = selects[0];

    await userEvent.selectOptions(productSelect, "1");

    await userEvent.click(screen.getByText("Adicionar"));

    expect(screen.getByText("Notebook")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Remover"));

    expect(
      screen.queryByRole("row", { name: /Notebook/i })
    ).not.toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", async () => {
    render(<FormularioVenda />);

    await userEvent.click(screen.getByText("Finalizar"));

    await waitFor(() => {
      expect(screen.getAllByText(/selecione/i).length).toBeGreaterThan(0);
    });
  });

  it("deve salvar venda", async () => {
    (salesService.createSale as Mock).mockResolvedValue({});

    render(<FormularioVenda />);

    const selects = await screen.findAllByRole("combobox");

    const productSelect = selects[0];
    const sellerSelect = selects[1];
    const customerSelect = selects[2];

    await userEvent.selectOptions(productSelect, "1");

    await userEvent.click(screen.getByText("Adicionar"));

    await userEvent.selectOptions(sellerSelect, "1");

    await userEvent.selectOptions(customerSelect, "1");

    await userEvent.click(screen.getByText("Finalizar"));

    await waitFor(() => {
      expect(salesService.createSale).toHaveBeenCalled();
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/vendas");
  });
});