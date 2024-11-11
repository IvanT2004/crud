import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './Logo2.jpeg';

const convertImageToDataURL = async (imageUrl) => {
  try {
    console.log(`Fetching image: ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Failed to fetch image. Status: ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching the image:', error);
    return null; // Devolver null en caso de error
  }
};

const generateReportPdf = async (reportData) => {
  
  reportData.images = reportData.images.map((img) => {
    if (!img.startsWith('http')) {
      const normalizedPath = img.startsWith('uploads/') ? img : `uploads/${img}`;
      return `${process.env.REACT_APP_API_URL || 'http://backend:5000'}/${normalizedPath}`;
    }
    return img;
  });  

  console.log('Generated Image URLs:', reportData.images);

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const observacionNormalizada = reportData.observacion?.trim().toLowerCase();

  const logoWidth = 60;
  const logoHeight = 25;
  const logoXPosition = (pageWidth / 2) - logoWidth - 33;
  const titleXPosition = pageWidth / 2;

  // Dibuja el contenedor principal
  const containerX = 10;
  const containerY = 10;
  const containerWidth = pageWidth - 20;
  doc.setDrawColor(33, 77, 178);
  doc.setLineWidth(0.5);
  doc.rect(containerX, containerY, containerWidth, 270);

  // Logo y título ajustados dentro del contenedor
  doc.addImage(logo, 'JPEG', logoXPosition, containerY + 5, logoWidth, logoHeight);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME TÉCNICO', titleXPosition, containerY + 18, { align: 'center' });

  // Tabla de detalles con títulos en gris claro
  doc.autoTable({
    startY: containerY + 30,
    margin: { left: containerX + 0, right: containerX + 0 },
    head: [['FECHA', 'TRABAJO', 'SERIAL']],
    body: [
      [
        reportData.timestamp ? new Date(reportData.timestamp).toLocaleDateString('es-CO') : '',
        'SERVICIOS OUTSOURCING',
        reportData.serial || ''
      ]
    ],
    styles: { fontSize: 10, cellPadding: 4, halign: 'center', lineColor: [33, 77, 178], lineWidth: 0.5, textColor: [0, 0, 0] },
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
    tableLineColor: [33, 77, 178],
    tableLineWidth: 0.5
  });

  // Tabla de Descripción del Daño, Observaciones y Solución Propuesta
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    margin: { left: containerX + 0, right: containerX + 0 },
    body: [
      [{ content: 'DESCRIPCIÓN DEL DAÑO', styles: { fillColor: [220, 220, 220], fontSize: 12, fontStyle: 'bold', halign: 'center', textColor: [0, 0, 0] } }],
      [{ content: reportData.damageDescription, styles: { fontSize: 10, halign: 'center', cellPadding: { top: 5, bottom: 5 }, textColor: [0, 0, 0] } }],
      [{ content: 'OBSERVACIONES', styles: { fillColor: [220, 220, 220], fontSize: 12, fontStyle: 'bold', halign: 'center', textColor: [0, 0, 0] } }],
      [{ content: observacionNormalizada === 'garantia' ? '* Garantía válida por 6 meses debido a fatiga de material.' : '* Revisar sistema de inyección y turbo', styles: { fontSize: 10, textColor: [0, 0, 0], halign: 'center', cellPadding: { top: 5, bottom: 5 } } }],
      [{ content: 'SOLUCIÓN PROPUESTA', styles: { fillColor: [220, 220, 220], fontSize: 12, fontStyle: 'bold', halign: 'center', textColor: [0, 0, 0] } }],
      [{ content: reportData.proposedSolution, styles: { fontSize: 10, halign: 'center', cellPadding: { top: 5, bottom: 5 }, textColor: [0, 0, 0] } }]
    ],
    styles: { fontSize: 10, cellPadding: 4, lineColor: [33, 77, 178], lineWidth: 0.5 },
    theme: 'grid',
    tableLineColor: [33, 77, 178],
    tableLineWidth: 0.5
  });

  // Título del bloque de imágenes
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    margin: { left: containerX + 0, right: containerX + 0 },
    body: [
      [
        {
          content: 'REGISTRO FOTOGRÁFICO DEL REPUESTO',
          styles: { fillColor: [220, 220, 220], fontSize: 12, fontStyle: 'bold', halign: 'center', textColor: [0, 0, 0] }
        }
      ]
    ],
    styles: { fontSize: 12, textColor: [0, 0, 0] },
    theme: 'grid',
    tableLineColor: [33, 77, 178],
    tableLineWidth: 0.5
  });

  const imgSectionY = doc.lastAutoTable.finalY + 8;
  const imageWidth = 40;
  const imageHeight = 30;
  const imagesPerRow = 3;
  const spacingBetweenImages = 10;

  const totalImageWidth = (imageWidth * imagesPerRow) + (spacingBetweenImages * (imagesPerRow - 1));
  const imgContainerWidth = containerWidth;
  const posXStart = containerX + (imgContainerWidth - totalImageWidth) / 2;
  let posX = posXStart;
  let posY = imgSectionY + 10;

  for (let i = 0; i < reportData.images.length; i++) {
    try {
      const imgData = await convertImageToDataURL(reportData.images[i]);
      if (imgData) {
        doc.addImage(imgData, 'JPEG', posX, posY, imageWidth, imageHeight);
        doc.text(
          `${new Date(reportData.imageTimestamp).toLocaleString('es-CO', { timeZone: 'America/Bogota' })} - Bogotá`,
          posX + imageWidth / 2,
          posY + imageHeight + 5,
          { align: 'center' }
        );
  
        posX += imageWidth + spacingBetweenImages;
        if ((i + 1) % imagesPerRow === 0) {
          posX = posXStart;
          posY += imageHeight + 10;
        }
      } else {
        console.warn(`Image at index ${i} could not be loaded: ${reportData.images[i]}`);
      }
    } catch (error) {
      console.error(`Error loading image at index ${i}: ${reportData.images[i]}`, error);
    }
  }  

  doc.save(`informe_tecnico_${reportData.serial}.pdf`);
};

export default generateReportPdf;
