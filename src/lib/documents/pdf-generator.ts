/**
 * Générateur de PDF pour les Documents Obligatoires
 * Utilise jsPDF et html2canvas pour générer des PDFs à partir de templates HTML
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TypeDocument } from '@/types/documents';

export class PDFGenerator {
  /**
   * Génère un PDF à partir d'un template HTML
   */
  static async genererPDF(
    htmlContent: string,
    filename: string,
    options: PDFOptions = {}
  ): Promise<Blob> {
    const {
      orientation = 'portrait',
      format = 'a4',
      margin = 10,
      scale = 2,
    } = options;

    // Créer un élément temporaire pour le rendu
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    document.body.appendChild(container);

    try {
      // Convertir le HTML en canvas
      const canvas = await html2canvas(container, {
        scale,
        useCORS: true,
        logging: false,
      });

      // Créer le PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
      });

      const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

      let heightLeft = imgHeight;
      let position = margin;

      // Ajouter l'image au PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Retourner le blob
      return pdf.output('blob');
    } finally {
      // Nettoyer
      document.body.removeChild(container);
    }
  }

  /**
   * Génère un PDF côté serveur (Node.js)
   * Utilise Puppeteer pour le rendu
   */
  static async genererPDFServeur(
    htmlContent: string,
    filename: string,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    // Cette méthode sera implémentée côté serveur avec Puppeteer
    // Pour l'instant, on retourne une erreur
    throw new Error('genererPDFServeur doit être appelé côté serveur uniquement');
  }

  /**
   * Ajoute un filigrane au PDF
   */
  static async ajouterFiligrane(
    pdfBlob: Blob,
    texte: string,
    options: FiligraneOptions = {}
  ): Promise<Blob> {
    const {
      opacity = 0.3,
      angle = -45,
      fontSize = 50,
      color = '#cccccc',
    } = options;

    // Charger le PDF existant
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdf = new jsPDF();
    
    // TODO: Implémenter l'ajout de filigrane
    // Pour l'instant, retourner le PDF original
    return pdfBlob;
  }

  /**
   * Ajoute une signature au PDF
   */
  static async ajouterSignature(
    pdfBlob: Blob,
    signatureImageUrl: string,
    position: SignaturePosition
  ): Promise<Blob> {
    // TODO: Implémenter l'ajout de signature
    return pdfBlob;
  }

  /**
   * Génère un QR code pour vérification du document
   */
  static async genererQRCode(data: string): Promise<string> {
    // Utiliser une bibliothèque comme qrcode
    const QRCode = require('qrcode');
    return await QRCode.toDataURL(data);
  }

  /**
   * Calcule le hash SHA-256 d'un document
   */
  static async calculerHash(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// =====================================================
// TYPES
// =====================================================

export interface PDFOptions {
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | 'legal';
  margin?: number;
  scale?: number;
}

export interface FiligraneOptions {
  opacity?: number;
  angle?: number;
  fontSize?: number;
  color?: string;
}

export interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  page?: number;
}

// =====================================================
// TEMPLATES HTML
// =====================================================

export class TemplateHTML {
  /**
   * Template de base avec header et footer
   */
  static base(content: string, options: TemplateBaseOptions = {}): string {
    const {
      titre = 'Document',
      organisme = 'Netz Informatique',
      logo = '/logo.png',
      footer = true,
    } = options;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titre}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          
          .header img {
            max-height: 60px;
          }
          
          .header h1 {
            font-size: 18pt;
            color: #0066cc;
            margin: 0;
          }
          
          .content {
            min-height: 700px;
          }
          
          .footer {
            border-top: 1px solid #ccc;
            padding-top: 10px;
            margin-top: 30px;
            font-size: 9pt;
            color: #666;
            text-align: center;
          }
          
          h2 {
            color: #0066cc;
            font-size: 14pt;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          
          h3 {
            color: #333;
            font-size: 12pt;
            margin-top: 15px;
            margin-bottom: 8px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          
          table th,
          table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .signature-block {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature {
            width: 45%;
            border-top: 1px solid #333;
            padding-top: 5px;
            text-align: center;
          }
          
          .mention-legale {
            font-size: 9pt;
            color: #666;
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 3px solid #0066cc;
          }
          
          .page-break {
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logo}" alt="${organisme}" />
          <h1>${titre}</h1>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        ${footer ? `
          <div class="footer">
            <p>${organisme} - Organisme de formation certifié Qualiopi</p>
            <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }

  /**
   * Template pour la convention
   */
  static convention(data: any): string {
    return this.base(`
      <h2>CONVENTION DE BILAN DE COMPÉTENCES</h2>
      
      <h3>Article 1 - Parties</h3>
      <table>
        <tr>
          <th>Bénéficiaire</th>
          <td>${data.beneficiaire.prenom} ${data.beneficiaire.nom}</td>
        </tr>
        <tr>
          <th>Organisme</th>
          <td>${data.organisme.raisonSociale}</td>
        </tr>
        ${data.entreprise ? `
          <tr>
            <th>Entreprise</th>
            <td>${data.entreprise.raisonSociale}</td>
          </tr>
        ` : ''}
      </table>
      
      <h3>Article 2 - Objet</h3>
      <p>${data.titre}</p>
      
      <h3>Article 3 - Durée et modalités</h3>
      <ul>
        <li>Durée : ${data.dureeHeures} heures</li>
        <li>Début : ${new Date(data.dateDebut).toLocaleDateString('fr-FR')}</li>
        <li>Fin prévue : ${new Date(data.dateFinPrevue).toLocaleDateString('fr-FR')}</li>
        <li>Modalité : ${data.modalites.presentiel ? 'Présentiel' : ''} ${data.modalites.distanciel ? 'Distanciel' : ''}</li>
      </ul>
      
      <h3>Article 4 - Tarification</h3>
      <table>
        <tr>
          <th>Montant total</th>
          <td>${data.tarif.montantTotal}€</td>
        </tr>
        <tr>
          <th>Pris en charge</th>
          <td>${data.tarif.montantPrisEnCharge || 0}€</td>
        </tr>
        <tr>
          <th>Reste à charge</th>
          <td>${data.tarif.montantRestant || 0}€</td>
        </tr>
      </table>
      
      <div class="mention-legale">
        <h4>Mentions légales</h4>
        <p>✓ Conformément au RGPD, vos données personnelles sont protégées</p>
        <p>✓ Vous disposez d'un droit de rétractation de 14 jours</p>
        <p>✓ La synthèse du bilan vous appartient et est confidentielle</p>
      </div>
      
      <div class="signature-block">
        <div class="signature">
          <p>Le bénéficiaire</p>
          <p>Date et signature</p>
        </div>
        <div class="signature">
          <p>L'organisme</p>
          <p>Date et signature</p>
        </div>
      </div>
    `, {
      titre: 'Convention de Bilan de Compétences',
    });
  }

  /**
   * Template pour la feuille d'émargement
   */
  static emargement(data: any): string {
    return this.base(`
      <h2>FEUILLE D'ÉMARGEMENT</h2>
      
      <table>
        <tr>
          <th>Séance n°</th>
          <td>${data.seance.numero}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>${new Date(data.seance.date).toLocaleDateString('fr-FR')}</td>
        </tr>
        <tr>
          <th>Horaires</th>
          <td>${data.seance.heureDebut} - ${data.seance.heureFin}</td>
        </tr>
        <tr>
          <th>Durée</th>
          <td>${data.seance.dureeMinutes} minutes</td>
        </tr>
        <tr>
          <th>Thème</th>
          <td>${data.seance.theme}</td>
        </tr>
        <tr>
          <th>Phase</th>
          <td>${data.seance.phase}</td>
        </tr>
        <tr>
          <th>Modalité</th>
          <td>${data.seance.modalite}</td>
        </tr>
      </table>
      
      <h3>Participants</h3>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Qualité</th>
            <th>Signature arrivée</th>
            <th>Signature départ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.beneficiaire.prenom} ${data.beneficiaire.nom}</td>
            <td>Bénéficiaire</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>${data.consultant.prenom} ${data.consultant.nom}</td>
            <td>Consultant</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      
      <h3>Contenu de la séance</h3>
      <p><strong>Objectifs :</strong></p>
      <ul>
        ${data.contenu.objectifs.map((obj: string) => `<li>${obj}</li>`).join('')}
      </ul>
      
      <p><strong>Activités réalisées :</strong></p>
      <ul>
        ${data.contenu.activitesRealisees.map((act: string) => `<li>${act}</li>`).join('')}
      </ul>
    `, {
      titre: 'Feuille d\'Émargement',
    });
  }
}

export interface TemplateBaseOptions {
  titre?: string;
  organisme?: string;
  logo?: string;
  footer?: boolean;
}

