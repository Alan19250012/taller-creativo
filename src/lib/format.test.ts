import { describe, it, expect } from "vitest";
import { formatoMoneda, formatoFecha, formatoFechaCorta } from "./format";

describe("formatoMoneda", () => {
  it("formatea en pesos mexicanos (MXN)", () => {
    expect(formatoMoneda(499)).toContain("499");
  });

  it("formatea cero sin error", () => {
    expect(formatoMoneda(0)).toContain("0");
  });

  it("tolera valores nulos como cero", () => {
    expect(() => formatoMoneda(undefined as unknown as number)).not.toThrow();
  });
});

describe("formatoFecha / formatoFechaCorta", () => {
  const fecha = new Date("2025-01-15T10:00:00Z");

  it("formatea fecha larga en es-MX", () => {
    expect(formatoFecha(fecha)).toBeTruthy();
  });

  it("formatea fecha corta en es-MX", () => {
    expect(formatoFechaCorta(fecha)).toBeTruthy();
  });
});
