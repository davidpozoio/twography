import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

describe("App component", () => {
  test("should render", () => {
    render(<App />, { wrapper: BrowserRouter });
  });
});
