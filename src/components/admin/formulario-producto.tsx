"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { SubirImagen } from "./subir-imagen";

interface Opcion {
  id: string;
  nombre: string;
}

interface TallaFormulario {
  nombre: string;
  stock: string;
  extra: string;
}

export function FormularioProducto({
  producto,
  categorias,
  subcategorias
}: {
  producto?: {
    id: string;
    nombre: string;
    descripcion: string;
    numeroArticulo: string;
    color: string | null;
    precioMinorista: number;
    precioDistribuidor: number;
    stock: number;
    destacado: boolean;
    nuevo: boolean;
    liquidacion: boolean;
    activo: boolean;
    imagen: string | null;
    categorias: { id: string }[];
    subcategorias: { id: string }[];
    tallas: { nombre: string; stock: number; extra: number }[];
  };
  categorias: Opcion[];
  subcategorias: Opcion[];
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [numeroArticulo, setNumeroArticulo] = useState(producto?.numeroArticulo ?? "");
  const [color, setColor] = useState(producto?.color ?? "");
  const [precioMinorista, setPrecioMinorista] = useState(String(producto?.precioMinorista ?? ""));
  const [precioDistribuidor, setPrecioDistribuidor] = useState(String(producto?.precioDistribuidor ?? ""));
  const [stock, setStock] = useState(String(producto?.stock ?? ""));
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);
  const [nuevo, setNuevo] = useState(producto?.nuevo ?? false);
  const [liquidacion, setLiquidacion] = useState(producto?.liquidacion ?? false);
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [imagen, setImagen] = useState(producto?.imagen ?? "");
  const [catSel, setCatSel] = useState<string[]>(producto?.categorias.map((c) => c.id) ?? []);
  const [subSel, setSubSel] = useState<string[]>(producto?.subcategorias.map((c) => c.id) ?? []);
  const [tallas, setTallas] = useState<TallaFormulario[]>(
    producto?.tallas.map((t) => ({ nombre: t.nombre, stock: String(t.stock), extra: String(t.extra) })) ?? []
  );
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function alternar(lista: string[], setLista: (v: string[]) => void, id: string) {
    setLista(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const cuerpo = {
      nombre,
      descripcion,
      numeroArticulo,
      color,
      precioMinorista: parseFloat(precioMinorista),
      precioDistribuidor: parseFloat(precioDistribuidor),
      stock: parseInt(stock) || 0,
      destacado,
      nuevo,
      liquidacion,
      activo,
      imagen,
      categorias: catSel,
      subcategorias: subSel,
      tallas: tallas.map((t) => ({ nombre: t.nombre, stock: parseInt(t.stock) || 0, extra: parseFloat(t.extra) || 0 }))
    };

    const res = await fetch(producto ? `/api/admin/productos/${producto.id}` : "/api/admin/productos", {
      method: producto ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });

    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Error al guardar.");
      setCargando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-6">
      <div className="tarjeta grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nombre *</label>
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Descripción *</label>
          <textarea className="input min-h-[120px]" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Número de artículo</label>
          <input className="input" value={numeroArticulo} onChange={(e) => setNumeroArticulo(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Color</label>
          <input className="input" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Precio minorista (MXN) *</label>
          <input type="number" step="0.01" className="input" value={precioMinorista} onChange={(e) => setPrecioMinorista(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Precio distribuidor (MXN) *</label>
          <input type="number" step="0.01" className="input" value={precioDistribuidor} onChange={(e) => setPrecioDistribuidor(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input type="number" className="input" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Imagen</label>
          <SubirImagen valor={imagen} onChange={setImagen} />
        </div>
      </div>

      <div className="tarjeta space-y-3 p-6">
        <h3 className="font-semibold">Etiquetas</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { etiqueta: "Destacado", valor: destacado, fn: setDestacado },
            { etiqueta: "Nuevo", valor: nuevo, fn: setNuevo },
            { etiqueta: "En oferta (liquidación)", valor: liquidacion, fn: setLiquidacion },
            { etiqueta: "Activo", valor: activo, fn: setActivo }
          ].map((c) => (
            <label key={c.etiqueta} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={c.valor} onChange={(e) => c.fn(e.target.checked)} />
              {c.etiqueta}
            </label>
          ))}
        </div>
      </div>

      <div className="tarjeta p-6">
        <h3 className="mb-3 font-semibold">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => alternar(catSel, setCatSel, c.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                catSel.includes(c.id) ? "border-[var(--color-primario)] bg-[var(--color-primario)] text-white" : "border-gray-300"
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        <h4 className="mb-3 mt-5 text-sm font-semibold text-gray-500">Subcategorías</h4>
        <div className="flex flex-wrap gap-2">
          {subcategorias.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => alternar(subSel, setSubSel, s.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                subSel.includes(s.id) ? "border-[var(--color-secundario)] bg-[var(--color-secundario)] text-white" : "border-gray-300"
              }`}
            >
              {s.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="tarjeta p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Tallas (hasta 6)</h3>
          <button
            type="button"
            onClick={() => tallas.length < 6 && setTallas([...tallas, { nombre: "", stock: "0", extra: "0" }])}
            className="btn-borde"
          >
            <Plus className="h-4 w-4" /> Agregar talla
          </button>
        </div>
        <div className="space-y-2">
          {tallas.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input"
                placeholder="Nombre (ej. M)"
                value={t.nombre}
                onChange={(e) => setTallas(tallas.map((x, j) => (j === i ? { ...x, nombre: e.target.value } : x)))}
              />
              <input
                className="input w-24"
                type="number"
                placeholder="Stock"
                value={t.stock}
                onChange={(e) => setTallas(tallas.map((x, j) => (j === i ? { ...x, stock: e.target.value } : x)))}
              />
              <input
                className="input w-24"
                type="number"
                step="0.01"
                placeholder="Extra $"
                value={t.extra}
                onChange={(e) => setTallas(tallas.map((x, j) => (j === i ? { ...x, extra: e.target.value } : x)))}
              />
              <button type="button" onClick={() => setTallas(tallas.filter((_, j) => j !== i))} className="p-2 text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={cargando} className="btn-primario">
          {cargando ? "Guardando…" : "Guardar producto"}
        </button>
        <button type="button" onClick={() => router.push("/admin/productos")} className="btn-borde">Cancelar</button>
      </div>
    </form>
  );
}
