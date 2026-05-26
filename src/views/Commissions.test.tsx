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

import CommissionsView from "./CommissionsView";

import { commissionService } from "../services/commissionService";

vi.mock("../services/commissionService", () => ({
  commissionService: {
    getCommissionsReport: vi.fn(),
  },
}));

describe("CommissionsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar a tela corretamente", () => {
    render(<CommissionsView />);

    expect(
      screen.getByText("Relatório de Comissões")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Selecione o Período")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Filtrar Período")
    ).toBeInTheDocument();
  });

  it("deve mostrar mensagem inicial antes da busca", () => {
    render(<CommissionsView />);

    expect(
      screen.getByText(
        /Selecione uma faixa de datas acima/i
      )
    ).toBeInTheDocument();
  });

  it("deve alterar os inputs de data", async () => {
    render(<CommissionsView />);

    const inputs = screen.getAllByRole("textbox");

    const startDateInput = inputs[0];
    const endDateInput = inputs[1];

    await userEvent.type(startDateInput, "2025-01-01");

    await userEvent.type(endDateInput, "2025-01-31");

    expect(startDateInput).toHaveValue("2025-01-01");

    expect(endDateInput).toHaveValue("2025-01-31");
  });

  it("deve chamar alert se datas não forem preenchidas", async () => {
    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(<CommissionsView />);

    await userEvent.click(
      screen.getByText("Filtrar Período")
    );

    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, selecione as duas datas para filtrar o período."
    );
  });

  it("deve buscar relatório de comissão", async () => {
    (commissionService.getCommissionsReport as Mock).mockResolvedValue({
      vendedores: [
        {
          id: 1,
          name: "João",
          total_vendas: 10,
          total_commission: 500,
        },
      ],
      total_commission_period: 500,
    });

    render(<CommissionsView />);

    const inputs = screen.getAllByRole("textbox");

    const startDateInput = inputs[0];
    const endDateInput = inputs[1];

    await userEvent.type(startDateInput, "2025-01-01");

    await userEvent.type(endDateInput, "2025-01-31");

    await userEvent.click(
      screen.getByText("Filtrar Período")
    );

    await waitFor(() => {
      expect(
        commissionService.getCommissionsReport
      ).toHaveBeenCalledWith(
        "2025-01-01",
        "2025-01-31"
      );
    });
  });

  it("deve renderizar vendedores após busca", async () => {
    (commissionService.getCommissionsReport as Mock).mockResolvedValue({
      vendedores: [
        {
          id: 1,
          name: "João",
          total_vendas: 10,
          total_commission: 500,
        },
      ],
      total_commission_period: 500,
    });

    render(<CommissionsView />);

    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "2025-01-01");

    await userEvent.type(inputs[1], "2025-01-31");

    await userEvent.click(
      screen.getByText("Filtrar Período")
    );

    expect(await screen.findByText("João")).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("deve renderizar total de comissão do período", async () => {
    (commissionService.getCommissionsReport as Mock).mockResolvedValue({
      vendedores: [
        {
          id: 1,
          name: "João",
          total_vendas: 10,
          total_commission: 500,
        },
      ],
      total_commission_period: 500,
    });

    render(<CommissionsView />);

    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "2025-01-01");

    await userEvent.type(inputs[1], "2025-01-31");

    await userEvent.click(
      screen.getByText("Filtrar Período")
    );

    expect(screen.getAllByText(/500,00/).length).toBeGreaterThan(0);
  });

  it("deve mostrar mensagem quando não houver comissões", async () => {
    (commissionService.getCommissionsReport as Mock).mockResolvedValue({
      vendedores: [],
      total_commission_period: 0,
    });

    render(<CommissionsView />);

    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "2025-01-01");

    await userEvent.type(inputs[1], "2025-01-31");

    await userEvent.click(
      screen.getByText("Filtrar Período")
    );

    expect(
      await screen.findByText(
        "Nenhuma comissão registrada para este período."
      )
    ).toBeInTheDocument();
  });

  it("deve mostrar erro ao falhar na API", async () => {
    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    (commissionService.getCommissionsReport as Mock).mockRejectedValue(
      new Error("Erro API")
    );

    render(<CommissionsView />);

    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "2025-01-01");

    await userEvent.type(inputs[1], "2025-01-31");

    await userEvent.click(
      screen.getByText("Filtrar Período")
    );

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Erro ao buscar dados do servidor."
      );
    });
  });
});