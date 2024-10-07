import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './Logo2.jpeg'; // Ajusta el path al logo

const generateTechnicalReportPdf = (data) => {
  const doc = new jsPDF();

  // Tamaño y posiciones para elementos en el PDF
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoWidth = 60;
  const logoHeight = 20;
  const logoXPosition = 10;
  const startY = 10;

  // Logo de la empresa
  doc.addImage(logo, 'JPEG', logoXPosition, startY, logoWidth, logoHeight);

  // Título del informe
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROCESO DE REPARACIONES', pageWidth / 2, startY + 20, { align: 'center' });

  // Información de encabezado
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const headerData = [
    { label: 'Fecha', value: new Date().toLocaleDateString() },
    { label: 'Trabajo', value: data.trabajo || '' },  // Validar que no sea null o undefined
    { label: 'Componente', value: data.componente || '' }  // Validar que no sea null o undefined
  ];

  let currentY = startY + 30;
  headerData.forEach(item => {
    doc.text(`${item.label}:`, 10, currentY);
    doc.text(item.value, 50, currentY);
    currentY += 6;
  });

  // Descripción del daño
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPCIÓN DEL DAÑO:', 10, currentY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.descripcionDanio || '', 10, currentY + 16, { maxWidth: pageWidth - 20 });

  // Solución Propuesta
  currentY += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('SOLUCIÓN PROPUESTA:', 10, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.solucionPropuesta || '', 10, currentY + 6, { maxWidth: pageWidth - 20 });

  // Observaciones
  currentY += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('OBSERVACIONES:', 10, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.observaciones || '', 10, currentY + 6, { maxWidth: pageWidth - 20 });

  // Fotos de evidencia (validar si existen imágenes)
  if (data.imagenes && Array.isArray(data.imagenes)) {
    currentY += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRO FOTOGRÁFICO DEL REPUESTO (Evidencia del Daño):', 10, currentY);

    // Añadir imágenes en fila
    let currentX = 10;
    const imageWidth = 35;
    const imageHeight = 35;
    const spacing = 10;

    data.imagenes.forEach((image, index) => {
      if (currentX + imageWidth > pageWidth) {
        currentX = 10;
        currentY += imageHeight + spacing;
      }
      doc.addImage(image, 'JPEG', currentX, currentY + 10, imageWidth, imageHeight);
      currentX += imageWidth + spacing;
    });
  } else {
    console.warn("No se encontraron imágenes para mostrar.");
  }

  // Asegurarse de que los valores no sean undefined antes de aplicar el formato
  const subTotal = data.subTotal !== undefined ? formatCurrency(data.subTotal) : '$0';
  const iva = data.iva !== undefined ? formatCurrency(data.iva, 0) : '$0';
  const total = data.total !== undefined ? formatCurrency(data.total, 0) : '$0';

  // Crear la tabla de resumen (Subtotal, IVA, Total)
  const summaryTableData = [
    ['Subtotal:', subTotal],
    ['IVA (19%):', iva],
    ['Total:', total],
  ];

  // Añadir la tabla de resumen
  currentY += 30;
  doc.autoTable({
    startY: currentY,
    body: summaryTableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      halign: 'right',
      cellPadding: 1,
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', fillColor: [240, 240, 240] },
      1: { halign: 'right' },
    },
    margin: { left: 116, right: 14 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
  });

  // Guardar el PDF
  doc.save(`informe_tecnico_${data.componente}.pdf`);
};

// Función para formatear los valores de moneda
const formatCurrency = (value, decimals = 0) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  }).format(value);
};

export default generateTechnicalReportPdf;
