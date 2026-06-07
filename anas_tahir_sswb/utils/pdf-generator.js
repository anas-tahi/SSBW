// Simple Text Receipt Generator
// This avoids heavy dependencies like puppeteer

export class PDFGenerator {
  static async generateInvoice(data) {
    try {
      console.log('📄 Generating receipt as text format');
      
      // Create simple text receipt
      const textContent = this.createTextInvoice(data);
      
      return Buffer.from(textContent, 'utf-8');
    } catch (error) {
      console.error('❌ Receipt generation failed:', error);
      throw error;
    }
  }

  static createTextInvoice(data) {
    const items = data.items || [];
    const itemsText = items.length > 0 
      ? items.map((item, index) => {
          const subtotal = (item.precio || 0) * (item.cantidad || 1);
          return `${index + 1}. ${item.nombre || 'Producto'}\n   Cantidad: ${item.cantidad || 1}\n   Precio: €${(item.precio || 0).toFixed(2)}\n   Subtotal: €${subtotal.toFixed(2)}`;
        }).join('\n\n')
      : 'No hay productos en esta factura';

    return `
====================================================
              TIENDA PRADO - RECIBO
====================================================

Número de Factura: ${data.invoiceNumber}
Fecha: ${new Date(data.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
Hora: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

----------------------------------------------------
DATOS DEL CLIENTE
----------------------------------------------------
Nombre: ${data.customerName || 'N/A'}
Email: ${data.customerEmail || 'N/A'}
Tarjeta: **** **** **** ${data.card_last4 || 'N/A'}

----------------------------------------------------
PRODUCTOS
----------------------------------------------------
${itemsText}

----------------------------------------------------
TOTALES
----------------------------------------------------
Subtotal: €${(data.subtotal || 0).toFixed(2)}
IVA (21%): €${(data.iva || 0).toFixed(2)}
Envío: €0.00
----------------------------------------------------
TOTAL: €${(data.total || 0).toFixed(2)}
====================================================

Estado: PAGADO ✓
Método de Pago: Tarjeta de Crédito
Moneda: EUR

Esta factura es válida como documento fiscal
Número de autenticación: ${data.invoiceNumber.slice(-6)}

Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
====================================================
`;
  }

  static async generateReceipt(orden, usuario) {
    try {
      console.log('📄 Starting receipt text generation');
      
      // Transform order data to match expected format
      const data = {
        invoiceNumber: orden.id.toString(),
        date: orden.fecha,
        customerName: usuario?.nombre || 'Cliente',
        customerEmail: usuario?.email || 'N/A',
        card_last4: '****',
        items: orden.items?.map(item => ({
          nombre: item.título,
          cantidad: item.cantidad,
          precio: parseFloat(item.precio)
        })) || [],
        subtotal: parseFloat(orden.subtotal) || 0,
        iva: parseFloat(orden.iva) || 0,
        total: parseFloat(orden.total) || 0
      };

      return await this.generateInvoice(data);
    } catch (error) {
      console.error('❌ Receipt generation failed:', error);
      throw error;
    }
  }
}
