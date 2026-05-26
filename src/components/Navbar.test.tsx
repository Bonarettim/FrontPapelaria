import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, it, expect, vi } from "vitest";

import Navbar from "./Navbar";

vi.mock("../assets/logoImg.png", () => ({
  default: "logo-mock.png",
}));

describe("Navbar", () => {
  it("deve renderizar a navbar", () => {
    render(<Navbar onToggleMenu={vi.fn()} />);

    expect(screen.getByAltText("Logo Papelaria")).toBeInTheDocument();

    expect(screen.getByText("Vendas")).toBeInTheDocument();
  });

  it("deve chamar onToggleMenu ao clicar no botão menu", async () => {
    const onToggleMenu = vi.fn();

    render(<Navbar onToggleMenu={onToggleMenu} />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(onToggleMenu).toHaveBeenCalled();
  });

  it("deve renderizar o ícone do menu", () => {
    render(<Navbar onToggleMenu={vi.fn()} />);

    const icon = document.querySelector(".bi-list");

    expect(icon).toBeInTheDocument();
  });

  it("deve renderizar a imagem da logo", () => {
    render(<Navbar onToggleMenu={vi.fn()} />);

    const logo = screen.getByAltText("Logo Papelaria");

    expect(logo).toHaveAttribute("src", "logo-mock.png");
  });

  it("deve mostrar título Comissões quando pathname for /comissoes", () => {
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/comissoes",
      },
      writable: true,
    });

    render(<Navbar onToggleMenu={vi.fn()} />);

    expect(screen.getByText("Comissões")).toBeInTheDocument();
  });

  it("deve mostrar título Vendas quando pathname for diferente de /comissoes", () => {
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/vendas",
      },
      writable: true,
    });

    render(<Navbar onToggleMenu={vi.fn()} />);

    expect(screen.getByText("Vendas")).toBeInTheDocument();
  });
});