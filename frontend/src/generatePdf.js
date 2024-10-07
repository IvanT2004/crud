import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './Logo2.jpeg'; // Ajusta el path al logo
import footerImage1 from './febi.png'; // Ajusta el path a las imágenes
import footerImage2 from './Federal.jpg';
import footerImage3 from './sachs.png';
import footerImage4 from './valeo.png';
import footerImage5 from './ZF.png';
import footerImage6 from './kolbensmitch.jpg';

const generatePdf = (item) => {
  const doc = new jsPDF();

  // Ancho de la página y del logo
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoWidth = 100;
  const logoHeight = 40;
  const logoXPosition = (pageWidth - logoWidth) / 2;

  // Añadir logo centrado
  doc.addImage(logo, 'JPEG', logoXPosition, 10, logoWidth, logoHeight, undefined, 'FAST');

  // Añadir información de contacto centrada debajo del logo
  const contactInfoY = 45;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('317 3721239 / 311 5611150', pageWidth / 2, contactInfoY, { align: 'center' });
  doc.text('Transversal 93 N 53 - 32 Bogotá', pageWidth / 2, contactInfoY + 5, { align: 'center' });
  doc.text('imdiesel@hotmail.com', pageWidth / 2, contactInfoY + 10, { align: 'center' });

  // Añadir título
  doc.setFontSize(20);

  // Formatear el ID con 4 dígitos
  const formattedId = `REM-ID${String(item.numero).padStart(4, '0')}`;

  // Añadir información de la cotización
  doc.setFontSize(11.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`N°. ${formattedId}`, 170, 56);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 63);
  doc.text(`Cotización: ${item.asunto}`, 14, 69);
  doc.text(`Cliente: ${item.cliente}`, 14, 76);

  // Función para formatear los números con separadores de miles y símbolo de pesos
  const formatCurrency = (value, decimals = 0) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(value);
  };

  // Añadir tabla de productos
  const productos = item.productos.map(p => [
    p.codigo || '',
    p.descripcion,
    p.cantidad,
    formatCurrency(p.valor),
    formatCurrency(p.total)
  ]);

  let startY = 80;
  const itemsPerPageFirst = 20; // Ajuste para primera página
  const itemsPerPageNext = 25;  // Ajuste para páginas siguientes
  let remainingProducts = productos;

  // Función para añadir una página con productos
  const addPageWithProducts = (productsToDisplay, isFirstPage = false) => {
    doc.autoTable({
      head: [['Código', 'Descripción', 'Q', 'Valor Unitario', 'Total']],
      body: productsToDisplay,
      startY: isFirstPage ? startY : 10, // En la primera página comenzamos en startY, en el resto comenzamos más arriba
      styles: {
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 25 },
        1: { halign: 'left', cellWidth: 85 },
        2: { halign: 'center', cellWidth: 10 },
        3: { halign: 'right', cellWidth: 30 },
        4: { halign: 'right', cellWidth: 30 }
      },
      margin: { bottom: 40 },
    });
  };

  // Generar las páginas con productos
  let isFirstPage = true;
  while (remainingProducts.length > 0) {
    const itemsPerPage = isFirstPage ? itemsPerPageFirst : itemsPerPageNext;
    const productsForPage = remainingProducts.slice(0, itemsPerPage);
    addPageWithProducts(productsForPage, isFirstPage);
    
    remainingProducts = remainingProducts.slice(itemsPerPage); // Reducir el array de productos
    isFirstPage = false;

    if (remainingProducts.length > 0) {
      doc.addPage(); // Agregar nueva página si quedan productos
    }
  }

  // Asegurarse de que los valores no sean undefined antes de aplicar el formato
  const subTotal = item.subTotal !== undefined ? formatCurrency(item.subTotal) : '$0';
  const iva = item.iva !== undefined ? formatCurrency(item.iva, 0) : '$0';
  const total = item.total !== undefined ? formatCurrency(item.total, 0) : '$0';

  // Crear la tabla de resumen (Subtotal, IVA, Total)
  const summaryTableData = [
    ['Subtotal:', subTotal],
    ['IVA (19%):', iva],
    ['Total:', total],
  ];

  const summaryYPosition = doc.internal.pageSize.getHeight() - 69;

  // Añadir la tabla de observaciones
  doc.autoTable({
    startY: summaryYPosition,
    body: [[item.observaciones || '']],
    theme: 'grid',
    styles: {
      fontSize: 10,
      halign: 'left',
      cellPadding: 1,
    },
    margin: { left: 14, right: 104 },
    tableWidth: 100,
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
  });

  // Añadir la tabla de resumen
  doc.autoTable({
    startY: summaryYPosition,
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

  // Añadir footer con compresión
  const footerStartY = summaryYPosition + 28;
  const footerImageWidth = 15;
  const footerImageHeight = 15;
  const footerImageXSpacing = 8;

  const footerImages = [footerImage1, footerImage2, footerImage3, footerImage4, footerImage5, footerImage6];
  let footerImageXPosition = (pageWidth - (footerImages.length * (footerImageWidth + footerImageXSpacing))) / 2;

  footerImages.forEach((image) => {
    doc.addImage(image, 'JPEG', footerImageXPosition, footerStartY, footerImageWidth, footerImageHeight, undefined, 'FAST');
    footerImageXPosition += footerImageWidth + footerImageXSpacing;
  });

  // Añadir mensaje de agradecimiento
  const messageYPosition = footerStartY + footerImageHeight + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('¡Gracias por confiar en nosotros!', pageWidth / 2, messageYPosition, { align: 'center' });

  // Guardar el PDF
  doc.save(`cotizacion_${formattedId}.pdf`);
};

export default generatePdf;
