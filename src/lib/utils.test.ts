import { describe, it, expect } from "vitest";
import { slugify, recortar, cn } from "./utils";

describe("slugify", () => {
  it("convierte texto con espacios y acentos a slug", () => {
    expect(slugify("Calabazas con luz")).toBe("calabazas-con-luz");
  });

  it("elimina símbolos especiales", () => {
    expect(slugify("PEANUTS®")).toBe("peanuts");
  });

  it("recorta guiones sobrantes", () => {
    expect(slugify("  ¡Hola, mundo!  ")).toBe("hola-mundo");
  });
});

describe("recortar", () => {
  it("recorta texto largo con puntos suspensivos", () => {
    expect(recortar("abcdefghij", 5)).toBe("abcde…");
  });

  it("no recorta texto corto", () => {
    expect(recortar("abc", 5)).toBe("abc");
  });
});

describe("cn", () => {
  it("une clases con clsx + tailwind-merge", () => {
    expect(cn("a", "b")).toBe("a b");
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
