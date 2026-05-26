import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import Sidebar from "./Sidebar";

const mockedNavigate = vi.fn();

const mockedLocation = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => mockedLocation(),
  };
});

describe("Sidebar", () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedLocation.mockReturnValue({
      pathname: "/vendas",
    });
  });

  it("deve renderizar menu Vendas", () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    expect(screen.getByText("Vendas")).toBeInTheDocument();
  });

  it("deve renderizar menu Comissões", () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    expect(screen.getByText("Comissões")).toBeInTheDocument();
  });

  it("deve navegar para vendas", async () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    await userEvent.click(screen.getByText("Vendas"));

    expect(mockedNavigate).toHaveBeenCalledWith("/vendas");
  });

  it("deve navegar para comissões", async () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    await userEvent.click(screen.getByText("Comissões"));

    expect(mockedNavigate).toHaveBeenCalledWith("/comissoes");
  });

  it("deve chamar onClose ao clicar em vendas", async () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    await userEvent.click(screen.getByText("Vendas"));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("deve chamar onClose ao clicar em comissões", async () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    await userEvent.click(screen.getByText("Comissões"));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("deve renderizar backdrop quando aberto", () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const backdrop = document.querySelector(
      ".position-fixed.top-0.start-0.w-100.h-100.d-md-none"
    );

    expect(backdrop).toBeInTheDocument();
  });

  it("não deve renderizar backdrop quando fechado", () => {
    render(
      <Sidebar
        isOpen={false}
        onClose={onCloseMock}
      />
    );

    const backdrop = document.querySelector(
      ".position-fixed.top-0.start-0.w-100.h-100.d-md-none"
    );

    expect(backdrop).not.toBeInTheDocument();
  });

  it("deve chamar onClose ao clicar no backdrop", async () => {
    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const backdrop = document.querySelector(
      ".position-fixed.top-0.start-0.w-100.h-100.d-md-none"
    );

    if (backdrop) {
      await userEvent.click(backdrop);
    }

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("deve marcar vendas como ativo", () => {
    mockedLocation.mockReturnValue({
      pathname: "/vendas",
    });

    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const vendasButton = screen.getByText("Vendas").closest("button");

    expect(vendasButton?.className).toContain("bg-light");
  });

  it("deve marcar comissões como ativo", () => {
    mockedLocation.mockReturnValue({
      pathname: "/comissoes",
    });

    render(
      <Sidebar
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const comissoesButton = screen
      .getByText("Comissões")
      .closest("button");

    expect(comissoesButton?.className).toContain("bg-light");
  });
});