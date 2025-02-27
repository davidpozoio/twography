import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import useAppStore from "../store/store";
import "@testing-library/jest-dom/vitest";

expect.extend(matchers);

const initialState = useAppStore.getInitialState();

afterEach(() => {
  useAppStore.setState(initialState);
  cleanup();
});
