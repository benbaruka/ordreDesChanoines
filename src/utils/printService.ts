// import puppeteer from 'puppeteer';

// export async function printDocument(documentData, printerName, copies) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.setContent(documentData); // documentData devrait être le HTML/CSS du document à imprimer

//   await page.emulateMediaType('print');
//   await page.pdf({
//     path: 'path-to-save-pdf', // optionnel, si vous voulez sauvegarder une copie
//     format: 'A4',
//     printBackground: true,
//   });

//   // Envoyer le PDF directement à l'imprimante spécifiée
//   const printers = await browser.pdfPrinters(); // Cette méthode n'existe pas dans Puppeteer officiel, cela nécessiterait une implémentation personnalisée ou un package supplémentaire pour gérer l'impression système.
//   const selectedPrinter = printers.find((p) => p.name === printerName);

//   if (selectedPrinter) {
//     // Code pour envoyer le document à l'imprimante, cela peut dépendre de la plateforme ou de l'API de l'imprimante
//     for (let i = 0; i < copies; i++) {
//       // Simuler l'envoi du PDF à l'imprimante
//     }
//   }

//   await browser.close();
// }
