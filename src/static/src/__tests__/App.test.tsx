import { render, screen } from "@testing-library/react";
import { describe, test } from "vitest";
import App from "../App";
import { Link, MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";
import { userEvent } from "@testing-library/user-event";

export const GlobalProviders = ({ children }: { children: ReactNode }) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

describe("App component", () => {
  test("should render", () => {
    render(<App />, { wrapper: GlobalProviders });
  });

  test("should show page not found", async () => {
    render(
      <>
        <App />
        <Link to="page-not-found">this page doesn't exist</Link>
      </>,
      { wrapper: GlobalProviders }
    );

    const link = screen.getByText("this page doesn't exist");
    await userEvent.click(link);
    screen.getByText(/Page not found/i);
  });
});
