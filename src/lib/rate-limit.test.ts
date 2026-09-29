import { describe, it, expect } from "vitest";
import { limitar } from "./rate-limit";

describe("limitar (rate limiting)", () => {
  it("permite hasta el máximo de intentos", () => {
    const clave = `ok-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(limitar(clave, 5).ok).toBe(true);
    }
  });

  it("bloquea después de superar el máximo", () => {
    const clave = `bloqueo-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 5; i++) limitar(clave, 5);
    const resultado = limitar(clave, 5);
    expect(resultado.ok).toBe(false);
    expect(resultado.reintentarEn).toBeGreaterThan(0);
  });
});
