import { expect, afterEach, vitest } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vitest.fn().mockImplementation(() => ({
    matchMedia: vitest.fn(),
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
  })),
});
