import PDFDocument from "pdfkit";

export interface DatosFactura {
  numero: string;
  empresa: string;
  telefono: string;
  correo: string;
  cliente: string;
  emailCliente: string;
  direccionEnvio: string;
  fecha: string;
  subtotal: number;
  impuesto: number;
  envio: number;
  total: number;
  items: { nombre: string; talla: string | null; cantidad: number; precio: number; tipo: string }[];
}

export function generarFacturaPDF(datos: DatosFactura): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const pedazos: Buffer[] = [];
    doc.on("data", (c: Buffer) => pedazos.push(c));
    doc.on("end", () => resolve(Buffer.concat(pedazos)));
    doc.on("error", reject);

    // Encabezado
    doc.fontSize(22).fillColor("#DA1D2A").text(datos.empresa, { align: "left" });
    doc.fontSize(10).fillColor("#333333");
    doc.text(`Teléfono: ${datos.telefono}`);
    doc.text(`Correo: ${datos.correo}`);
    doc.moveDown();

    doc.fontSize(18).fillColor("#244093").text("FACTURA", { align: "right" });
    doc.fontSize(10).fillColor("#333333");
    doc.text(`Número: ${datos.numero}`, { align: "right" });
    doc.text(`Fecha: ${datos.fecha}`, { align: "right" });
    doc.moveDown();

    // Cliente
    doc.fontSize(11).fillColor("#000000").text("Facturado a:");
    doc.fontSize(10).fillColor("#333333");
    doc.text(datos.cliente);
    doc.text(datos.emailCliente);
    doc.text(`Envío a: ${datos.direccionEnvio}`);
    doc.moveDown();

    // Tabla
    const inicioY = doc.y;
    doc.fontSize(10).fillColor("#000000");
    doc.text("Producto", 50, inicioY);
    doc.text("Cant.", 320, inicioY);
    doc.text("Precio", 380, inicioY);
    doc.text("Importe", 460, inicioY);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    for (const item of datos.items) {
      doc.moveDown(0.4);
      const etiqueta = `${item.nombre}${item.talla ? ` (${item.talla})` : ""}`;
      doc.text(etiqueta, 50, doc.y, { width: 260 });
      doc.text(String(item.cantidad), 320, doc.y - 14);
      doc.text(`$${item.precio.toFixed(2)}`, 380, doc.y - 14);
      doc.text(`$${(item.precio * item.cantidad).toFixed(2)}`, 460, doc.y - 14);
      doc.moveDown(0.8);
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    const alinear = (etiqueta: string, valor: string) => {
      doc.text(etiqueta, 380, doc.y);
      doc.text(valor, 460, doc.y - 12, { align: "right" });
      doc.moveDown(0.6);
    };

    alinear("Subtotal:", `$${datos.subtotal.toFixed(2)}`);
    alinear("IVA (16%):", `$${datos.impuesto.toFixed(2)}`);
    alinear("Envío:", `$${datos.envio.toFixed(2)}`);
    doc.fontSize(13).fillColor("#DA1D2A");
    alinear("TOTAL:", `$${datos.total.toFixed(2)}`);

    doc.fontSize(9).fillColor("#777777").moveDown(2);
    doc.text("Gracias por tu compra. Este documento es una representación de la factura.", { align: "center" });

    doc.end();
  });
}
