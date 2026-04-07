// PDF Generator using Puppeteer for real PDF creation
import puppeteer from 'puppeteer';

export class PDFGenerator {
  static async generateInvoice(data) {
    try {
      console.log('📄 Starting PDF generation with Puppeteer');
      
      // Create HTML content
      const htmlContent = this.createHTMLInvoice(data);
      
      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      
      const page = await browser.newPage();
      
      // Set content and wait for it to load
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        preferCSSPageSize: true
      });
      
      await browser.close();
      
      console.log('✅ PDF generated successfully with Puppeteer, size:', pdfBuffer.length);
      return pdfBuffer;
      
    } catch (error) {
      console.error('❌ Puppeteer PDF generation failed:', error);
      
      // Fallback to HTML
      console.log('🔄 Falling back to HTML format');
      const htmlContent = this.createHTMLInvoice(data);
      return Buffer.from(htmlContent, 'utf-8');
    }
  }
  
  static createHTMLInvoice(data) {
    const items = data.items || [];
    const itemsHTML = items.length > 0 
      ? items.map(item => `
          <tr>
            <td>${item.nombre || 'Producto'}</td>
            <td style="text-align: center;">${item.cantidad || 1}</td>
            <td style="text-align: right;">€${(item.precio || 0).toFixed(2)}</td>
            <td style="text-align: right;">€${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</td>
          </tr>
        `).join('')
      : `<tr><td colspan="4" style="text-align: center; padding: 20px;">No hay productos</td></tr>`;
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Factura ${data.invoiceNumber}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #ffffff;
            color: #333333;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .invoice-container {
            max-width: 100%;
            margin: 0 auto;
        }
        
        .invoice-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #c9a84c;
            padding-bottom: 20px;
        }
        
        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #c9a84c;
            margin: 0 0 10px 0;
        }
        
        .invoice-subtitle {
            font-size: 16px;
            color: #666666;
            margin: 5px 0;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .info-section {
            background: #f9f9f9;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        
        .info-title {
            font-weight: bold;
            color: #c9a84c;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
        }
        
        .info-item {
            margin: 5px 0;
            font-size: 12px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
            border: 1px solid #e0e0e0;
        }
        
        .items-table th {
            background: #c9a84c;
            color: #ffffff;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #c9a84c;
        }
        
        .items-table td {
            padding: 10px;
            border: 1px solid #e0e0e0;
            vertical-align: top;
        }
        
        .items-table .text-right {
            text-align: right;
        }
        
        .totals-section {
            margin-top: 20px;
            padding: 15px;
            background: #f9f9f9;
            border: 1px solid #c9a84c;
            border-radius: 5px;
        }
        
        .totals-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 12px;
        }
        
        .totals-row.grand-total {
            font-size: 16px;
            font-weight: bold;
            color: #c9a84c;
            border-top: 2px solid #c9a84c;
            padding-top: 12px;
            margin-top: 15px;
        }
        
        .invoice-footer {
            margin-top: 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            font-size: 10px;
            color: #666666;
        }
        
        .company-info {
            margin-bottom: 10px;
            font-size: 11px;
        }
        
        .footer-note {
            margin-top: 15px;
            font-style: italic;
        }
        
        @media print {
            body { margin: 0; }
            .info-grid { grid-template-columns: 1fr 1fr; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <h1 class="invoice-title">FACTURA ELECTRÓNICA</h1>
            <div class="invoice-subtitle">Tienda Prado</div>
            <div class="invoice-subtitle">N°: ${data.invoiceNumber}</div>
            <div class="invoice-subtitle">Fecha: ${new Date(data.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="invoice-subtitle">Hora: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        
        <div class="info-grid">
            <div class="info-section">
                <div class="info-title">Datos del Cliente</div>
                <div class="info-item"><strong>Nombre:</strong> ${data.customerName || 'N/A'}</div>
                <div class="info-item"><strong>Email:</strong> ${data.customerEmail}</div>
                <div class="info-item"><strong>Tarjeta:</strong> **** **** **** ${data.card_last4 || 'N/A'}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">Datos de Facturación</div>
                <div class="info-item"><strong>Método de Pago:</strong> Tarjeta de Crédito</div>
                <div class="info-item"><strong>Estado:</strong> Pagado ✓</div>
                <div class="info-item"><strong>Moneda:</strong> EUR</div>
                <div class="info-item"><strong>Referencia:</strong> ${data.invoiceNumber.slice(-6)}</div>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th style="width: 60px;">Cantidad</th>
                    <th style="width: 80px;">Precio Unit.</th>
                    <th style="width: 80px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <div class="totals-section">
            <div class="totals-row">
                <span>Subtotal:</span>
                <span>€${parseFloat(data.subtotal || 0).toFixed(2)}</span>
            </div>
            <div class="totals-row">
                <span>IVA (21%):</span>
                <span>€${parseFloat(data.iva || 0).toFixed(2)}</span>
            </div>
            <div class="totals-row">
                <span>Envío:</span>
                <span>€${parseFloat(data.envio || 0).toFixed(2)}</span>
            </div>
            <div class="totals-row grand-total">
                <span>TOTAL:</span>
                <span>€${parseFloat(data.total || 0).toFixed(2)}</span>
            </div>
        </div>
        
        <div class="invoice-footer">
            <div class="company-info">
                <strong>Tienda Prado</strong> | C/ Comercio, 123 | 28001 Madrid, España
            </div>
            <div class="company-info">
                CIF: B-12345678 | Tel: +34 912 345 678 | email: info@tiendaprado.com
            </div>
            <div class="footer-note">
                Esta factura es válida como documento fiscal | Número de autenticación: ${data.invoiceNumber.slice(-6)}
            </div>
            <div class="footer-note">
                Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}
