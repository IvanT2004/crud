import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './Logo.jpeg'; // Ajusta el path al logo

const generatePdf = (item) => {
  const doc = new jsPDF();

  // Añadir logo
  doc.addImage(logo, 'PNG', 14, 10, 50, 15); // Ajusta las posiciones y el tamaño según sea necesario

  // Añadir título
  doc.setFontSize(20);

  // Formatear el ID
  const formattedId = `REM-ID${String(item.numero).padStart(2, '0')}`;

  // Añadir información de la cotización
  doc.setFontSize(10);
  doc.text(`N°. ${formattedId}`, 14, 41);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 47);
  doc.text(`Cotización: ${item.asunto}`, 14, 53); // Agrega el asunto aquí
  doc.text(`Para: ${item.cliente}`, 14, 59); // Muestra el cliente aquí
  doc.text('Empresa: Importaciones Diesel', 14, 65);

  // Añadir tabla de productos
  const productos = item.productos.map(p => [
    p.codigo,
    p.descripcion,
    p.cantidad,
    p.valor,
    p.total
  ]);

  doc.autoTable({
    head: [['Código', 'Descripción', 'Cantidad', 'Valor Unitario', 'Total']],
    body: productos,
    startY: 70,
  });

  // Asegurarse de que los valores no sean undefined antes de aplicar toFixed
  const subTotal = item.subTotal !== undefined ? item.subTotal.toFixed(2) : '0.00';
  const iva = item.iva !== undefined ? item.iva.toFixed(2) : '0.00';
  const total = item.total !== undefined ? item.total.toFixed(2) : '0.00';

  // Añadir resumen
  doc.text(`Subtotal: $${subTotal}`, 150, doc.autoTable.previous.finalY + 10, null, null, 'right');
  doc.text(`IVA (19%): $${iva}`, 150, doc.autoTable.previous.finalY + 15, null, null, 'right');
  doc.text(`Total: $${total}`, 150, doc.autoTable.previous.finalY + 20, null, null, 'right');

  // Añadir método de pago
  doc.text('METODO DE PAGO', 14, doc.autoTable.previous.finalY + 30);
  doc.text('Cuenta: 0123 4567 8901', 14, doc.autoTable.previous.finalY + 35);
  doc.text('Tarjeta: 0123 4567 8901 2345', 14, doc.autoTable.previous.finalY + 40);

  // Guardar el PDF
  doc.save(`cotizacion_${formattedId}.pdf`);
};

export default generatePdf;