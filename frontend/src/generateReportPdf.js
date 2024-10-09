import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './Logo2.jpeg'; // Ajusta el path al logo

const generateReportPdf = (reportData) => {
  const doc = new jsPDF();

  // Ancho de la página y del logo
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoWidth = 40;  // Hacer el logo más pequeño
  const logoHeight = 15;
  const logoXPosition = 10;  // Colocar el logo en la parte superior izquierda

  // Añadir logo en la esquina superior izquierda
  doc.addImage(logo, 'JPEG', logoXPosition, 10, logoWidth, logoHeight);

  // Normalizar el valor de la observación para la comparación
  const observacionNormalizada = reportData.observacion?.trim().toLowerCase();
  console.log(reportData.observacion);
  // Verificar si la observación contiene palabras clave relevantes
  const esReparacionMayor = observacionNormalizada.includes('revision') 

  // Título dinámico basado en la observación
  const title = esReparacionMayor ? 'REPARACIONES MAYORES' : 'PROCESO DE REPARACIONES';
  
  // Añadir título centrado
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 30, { align: 'center' });

  // Fecha y Serial/Componente (centrado)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${reportData.date}`, pageWidth / 2, 50, { align: 'center' });
  doc.text(`Componente: ${reportData.serial}`, pageWidth / 2, 60, { align: 'center' });

  // Descripción del daño (centrado)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción del Daño', pageWidth / 2, 80, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(reportData.damageDescription, pageWidth / 2, 90, { align: 'center', maxWidth: 170 });
  
  // Solución propuesta (centrado con texto quemado)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Solución Propuesta', pageWidth / 2, 120, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Cambiar componentes para poner parte a punto', pageWidth / 2, 130, { align: 'center', maxWidth: 170 });//
  
  // Observaciones (centrado con opción seleccionada)
  const observacion = observacionNormalizada === 'garantia' 
    ? '* Garantía válida por 6 meses debido a fatiga de material.'
    : '* Revisar sistema de inyeccion y turbo';
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Observaciones', pageWidth / 2, 160, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(observacion, pageWidth / 2, 170, { align: 'center', maxWidth: 170 });

  // Añadir imágenes en dos filas, hasta 6 imágenes por página
  let imageX = (pageWidth - (3 * 40 + 2 * 10)) / 2; // Centrar las imágenes en la fila
  let imageY = 190;
  const imageWidth = 40; // Reducir el ancho de las imágenes
  const imageHeight = 30; // Reducir la altura de las imágenes
  const imageSpacingX = 10; // Espaciado entre imágenes horizontal
  const imageSpacingY = 15; // Espaciado entre imágenes vertical
  let imageCount = 0;

  reportData.images.forEach((image, index) => {
    const imgData = URL.createObjectURL(image);

    // Si se han añadido 3 imágenes en una fila, saltar a la siguiente fila
    if (imageCount === 3) {
      imageX = (pageWidth - (3 * 40 + 2 * 10)) / 2; // Centrar las imágenes en la nueva fila
      imageY += imageHeight + imageSpacingY;
      imageCount = 0;
    }

    // Añadir la imagen
    doc.addImage(imgData, 'JPEG', imageX, imageY, imageWidth, imageHeight);
    imageX += imageWidth + imageSpacingX;
    imageCount += 1;

    // Si se han añadido 6 imágenes (dos filas), pasar a la siguiente página
    if (index > 0 && (index + 1) % 6 === 0) {
      doc.addPage();
      imageX = (pageWidth - (3 * 40 + 2 * 10)) / 2;
      imageY = 190;
      imageCount = 0;
    }
  });

  // Guardar el PDF
  doc.save(`informe_tecnico_${reportData.serial}.pdf`);
};

export default generateReportPdf;
