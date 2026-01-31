import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";

// Mock useAuth hook
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signOut: vi.fn(),
  }),
}));

describe("Layout", () => {
  it("renders the header with logo", () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    expect(screen.getByText("Schredder")).toBeInTheDocument();
  });

  it("shows login and register links when not authenticated", () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    expect(screen.getByText("Anmelden")).toBeInTheDocument();
    expect(screen.getByText("Registrieren")).toBeInTheDocument();
  });
});
