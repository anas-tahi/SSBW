import { Resend } from 'resend';
import logger from '../logger';

const resend = new Resend(process.env.RESEND_API_KEY || 're_YOUR_API_KEY');
const FROM_EMAIL = 'Tienda Prado <noreply@tiendaprado.com>';

export async function sendWelcomeEmail(email: string, nombre: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '¡Bienvenido a Tienda Prado!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #c9a84c, #d4af37); padding: 40px; text-align: center;">
            <h1 style="color: #0a0a0f; margin: 0;">Tienda Prado</h1>
            <p style="color: #0a0a0f; font-size: 18px;">Galería de Arte</p>
          </div>
          <div style="padding: 40px; background: #fff;">
            <h2 style="color: #0a0a0f;">¡Hola ${nombre}!</h2>
            <p>Gracias por registrarte en Tienda Prado. Tu cuenta ha sido creada exitosamente.</p>
            <p>Ahora puedes:</p>
            <ul>
              <li>Explorar nuestra galería de arte</li>
              <li>Guardar tus obras favoritas</li>
              <li>Realizar compras de forma segura</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/" 
                 style="background: #c9a84c; color: #0a0a0f; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: bold; display: inline-block;">
                Explorar Galería
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">
              Si no creaste esta cuenta, puedes ignorar este mensaje.
            </p>
          </div>
          <div style="background: #0a0a0f; color: #c9a84c; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 Tienda Prado. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    logger.info(`Welcome email sent to ${email}`);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    logger.error('Exception sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderConfirmation(email: string, nombre: string, orderDetails: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Confirmación de Pedido - Tienda Prado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #c9a84c, #d4af37); padding: 40px; text-align: center;">
            <h1 style="color: #0a0a0f; margin: 0;">¡Pedido Confirmado!</h1>
          </div>
          <div style="padding: 40px; background: #fff;">
            <h2 style="color: #0a0a0f;">Hola ${nombre},</h2>
            <p>Tu pedido ha sido procesado exitosamente.</p>
            
            <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Resumen del Pedido</h3>
              <p><strong>Número de Pedido:</strong> ${orderDetails.orderId}</p>
              <p><strong>Total:</strong> ¥${orderDetails.total.toFixed(2)}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/perfil" 
                 style="background: #c9a84c; color: #0a0a0f; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: bold; display: inline-block;">
                Ver Mis Pedidos
              </a>
            </div>
          </div>
          <div style="background: #0a0a0f; color: #c9a84c; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 Tienda Prado. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error('Error sending order confirmation:', error);
      return { success: false, error };
    }

    logger.info(`Order confirmation sent to ${email}`);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    logger.error('Exception sending order confirmation:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordReset(email: string, resetToken: string) {
  try {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Restablecer Contraseña - Tienda Prado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #c9a84c, #d4af37); padding: 40px; text-align: center;">
            <h1 style="color: #0a0a0f; margin: 0;">Restablecer Contraseña</h1>
          </div>
          <div style="padding: 40px; background: #fff;">
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #c9a84c; color: #0a0a0f; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: bold; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="font-size: 12px; color: #666;">
              Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este mensaje.
            </p>
          </div>
          <div style="background: #0a0a0f; color: #c9a84c; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 Tienda Prado. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error('Error sending password reset:', error);
      return { success: false, error };
    }

    logger.info(`Password reset email sent to ${email}`);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    logger.error('Exception sending password reset:', error);
    return { success: false, error: error.message };
  }
}

export async function sendContactReply(email: string, nombre: string, message: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Hemos recibido tu mensaje - Tienda Prado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #c9a84c, #d4af37); padding: 40px; text-align: center;">
            <h1 style="color: #0a0a0f; margin: 0;">Mensaje Recibido</h1>
          </div>
          <div style="padding: 40px; background: #fff;">
            <h2 style="color: #0a0a0f;">Hola ${nombre},</h2>
            <p>Gracias por contactarnos. Hemos recibido tu mensaje:</p>
            
            <blockquote style="background: #f8f8f8; padding: 20px; border-left: 4px solid #c9a84c; margin: 20px 0;">
              ${message}
            </blockquote>
            
            <p>Te responderemos lo antes posible.</p>
          </div>
          <div style="background: #0a0a0f; color: #c9a84c; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 Tienda Prado. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error('Error sending contact reply:', error);
      return { success: false, error };
    }

    logger.info(`Contact reply sent to ${email}`);
    return { success: true, messageId: data?.id };
  } catch (error: any) {
    logger.error('Exception sending contact reply:', error);
    return { success: false, error: error.message };
  }
}
