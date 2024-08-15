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
  const pageHeight = doc.internal.pageSize.getHeight();
  const logoWidth = 100; // Ajusta el tamaño del logo aquí
  const logoHeight = 40; // Ajusta el tamaño del logo aquí
  const logoXPosition = (pageWidth - logoWidth) / 2; // Centrando el logo

  // Añadir logo centrado
  doc.addImage(logo, 'PNG', logoXPosition, 10, logoWidth, logoHeight);

  // Añadir información de contacto centrada debajo del logo
  const contactInfoY = 45; // Ajusta la posición vertical según sea necesario
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('317 3721239 / 311 5611150', pageWidth / 2, contactInfoY, { align: 'center' });
  doc.text('Transversal 93 N 53 - 32 Bogotá', pageWidth / 2, contactInfoY + 5, { align: 'center' });
  doc.text('imdiesel@hotmail.com', pageWidth / 2, contactInfoY + 10, { align: 'center' });

  // Añadir título
  doc.setFontSize(20);

  // Formatear el ID con 4 dígitos, si se necesita más, cambia el número en padStart
  const formattedId = `REM-ID${String(item.numero).padStart(4, '0')}`;

  // Añadir información de la cotización
  doc.setFontSize(11.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`N°. ${formattedId}`, 170, 56);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 63);
  doc.text(`Cotización: ${item.asunto}`, 14, 69); // Agrega el asunto aquí
  doc.text(`Cliente: ${item.cliente}`, 14, 76); // Muestra el cliente aquí

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
    p.codigo || '', // Asegúrate de que se incluya un valor vacío si no hay código
    p.descripcion,
    p.cantidad,
    formatCurrency(p.valor),
    formatCurrency(p.total)
]);

  let startY = 80;

  if (productos.length <= 20) {
    doc.autoTable({
      head: [['Código', 'Descripción', 'Q', 'Valor Unitario', 'Total']],
      body: productos,
      startY: startY,
      styles: {
        halign: 'center', // Alinea los valores a la derecha
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 25 },  // Código a la izquierda, ajustar ancho
        1: { halign: 'left', cellWidth: 85 },  // Descripción a la izquierda, ajustar ancho
        2: { halign: 'center', cellWidth: 10 }, // Cantidad centrada, ajustar ancho
        3: { halign: 'right', cellWidth: 30 }, // Valor Unitario a la derecha, ajustar ancho
        4: { halign: 'right', cellWidth: 30 }  // Total a la derecha, ajustar ancho
      },
      margin: { bottom: 40 }, // Reservar espacio para el footer
    });
} else {
    const firstPageProducts = productos.slice(0, 20);
    const nextPageProducts = productos.slice(20);

    // Primera página con 20 productos
    doc.autoTable({
      head: [['Código', 'Descripción', 'Q', 'Valor Unitario', 'Total']],
      body: firstPageProducts,
      startY: startY,
      styles: {
        halign: 'center', // Alinea los valores a la derecha
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 25 },  // Código a la izquierda, ajustar ancho
        1: { halign: 'left', cellWidth: 85},  // Descripción a la izquierda, ajustar ancho
        2: { halign: 'center', cellWidth: 10 }, // Cantidad centrada, ajustar ancho
        3: { halign: 'right', cellWidth: 30 }, // Valor Unitario a la derecha, ajustar ancho
        4: { halign: 'right', cellWidth: 30 }  // Total a la derecha, ajustar ancho
      },
      margin: { bottom: 40 }, // Reservar espacio para el footer
    });

    doc.addPage();

    // Segunda página con los productos restantes
    doc.autoTable({
      head: [['Código', 'Descripción', 'Q', 'Valor Unitario', 'Total']],
      body: nextPageProducts,
      startY: 20,
      styles: {
        halign: 'center', // Alinea los valores a la derecha
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 25 },  // Código a la izquierda, ajustar ancho
        1: { halign: 'left', cellWidth: 85 },  // Descripción a la izquierda, ajustar ancho
        2: { halign: 'center', cellWidth: 10 }, // Cantidad centrada, ajustar ancho
        3: { halign: 'right', cellWidth: 30 }, // Valor Unitario a la derecha, ajustar ancho
        4: { halign: 'right', cellWidth: 30 }  // Total a la derecha, ajustar ancho
      },
      margin: { bottom: 40 }, // Reservar espacio para el footer
    });
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

  // Añadir título de observaciones
  const observationsTitleY = doc.internal.pageSize.getHeight() - 72; // Ajusta la posición del título de observaciones
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Observaciones:', 14, observationsTitleY);

  const summaryYPosition = doc.internal.pageSize.getHeight() - 69; // Ajusta la posición de la tabla de resumen

  // Crear la tabla de observaciones
  const observationsTableData = [
    [item.observaciones || '']
  ];

  // Añadir la tabla de observaciones
  doc.autoTable({
    startY: summaryYPosition,
    body: observationsTableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      halign: 'left',
      cellPadding: 1,
    },
    margin: { left: 14, right: 104 }, // Ajusta los márgenes para dar espacio horizontal
    tableWidth: 100, // Ajusta el ancho de la tabla de observaciones
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
      0: { halign: 'left', fontStyle: 'bold', fillColor: [240, 240, 240] }, // Alínea a la izquierda, en negrita y fondo gris claro
      1: { halign: 'right' }, // Alínea a la derecha
    },
    margin: { left: 116, right: 14 }, // Ajusta los márgenes para dar espacio horizontal
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
  });

  // Añadir margen inferior al final de la página
  doc.setDrawColor(0); // Color de borde
  doc.setLineWidth(0.5); // Ancho de borde
  doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20); // Línea de margen al final

  // Añadir footer
  const footerStartY = summaryYPosition + 28; // Posición Y del inicio del footer
  const footerImageWidth = 15;
  const footerImageHeight = 15;
  const footerImageXSpacing = 8;
  
  const footerImageSizes = [
    { width: footerImageWidth, height: footerImageHeight },
    { width: footerImageWidth, height: footerImageHeight },
    { width: footerImageWidth + 5, height: footerImageHeight + 5 }, // Agrandar imagen 3
    { width: footerImageWidth, height: footerImageHeight },
    { width: footerImageWidth, height: footerImageHeight },
    { width: footerImageWidth + 5, height: footerImageHeight + 5 }, // Agrandar imagen 6
  ];

  const footerImages = [footerImage1, footerImage2, footerImage3, footerImage4, footerImage5, footerImage6];
  
  let footerImageXPosition = (pageWidth - (footerImages.length * (footerImageWidth + footerImageXSpacing))) / 2;

  footerImages.forEach((image, index) => {
    const { width, height } = footerImageSizes[index];
    doc.addImage(image, 'PNG', footerImageXPosition, footerStartY, width, height);
    footerImageXPosition += width + footerImageXSpacing;
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
