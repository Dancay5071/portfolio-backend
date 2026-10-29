import nodemailer from 'nodemailer';

// Función para escapar caracteres especiales de HTML y prevenir inyecciones
const escapeHtml = (text = '') => {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Singleton: Crear el transporter una sola vez para reutilizar conexiones
let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

export const sendNotificationEmail = async ({ nombre, email, mensaje }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('ℹ️ [Email]: Modo local. Mensaje guardado en Supabase, pero falta configurar EMAIL_USER y EMAIL_PASS en .env.');
    return { sent: false, reason: 'credentials_missing' };
  }

  const mailTransporter = getTransporter();

  // Sanitizamos los datos antes de introducirlos en la plantilla HTML
  const safeNombre = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);
  const safeMensajeHtml = escapeHtml(mensaje).replace(/\n/g, '<br />');

  const mailOptions = {
    from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `✨ Nuevo mensaje de ${safeNombre} en tu Portfolio`,
    // Versión en texto plano para clientes simples y para evitar filtros de spam
    text: `Nuevo mensaje de contacto:\n\nNombre: ${nombre}\nEmail: ${email}\nMensaje:\n${mensaje}\n\nEnviado desde tu Portfolio.`,
    // Versión visual estilizada y sanitizada
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0914; color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c084fc; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-top: 0;">
          ✨ ¡Nuevo mensaje de contacto!
        </h2>
        <p style="margin: 8px 0;"><strong>Nombre:</strong> ${safeNombre}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a></p>
        <p style="margin: 16px 0 8px 0;"><strong>Mensaje:</strong></p>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7; font-style: italic; line-height: 1.6; color: #e2d9fe;">
          "${safeMensajeHtml}"
        </div>
        <br />
        <small style="color: #94a3b8; display: block; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
          Recibido desde tu Portfolio Web. Podés responder directamente a este correo para contestarle a ${safeNombre}.
        </small>
      </div>
    `,
  };

  return await mailTransporter.sendMail(mailOptions);
};

export const sendCvRequestNotificationEmail = async ({ nombre, email, empresa }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('ℹ️ [Email]: Modo local. Solicitud de CV procesada, pero falta configurar EMAIL_USER y EMAIL_PASS en .env.');
    return { sent: false, reason: 'credentials_missing' };
  }

  const mailTransporter = getTransporter();

  const safeNombre = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);
  const safeEmpresa = escapeHtml(empresa || 'No especificada');

  const mailOptions = {
    from: `"Portfolio - Solicitud de CV" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `📄 ¡Alguien solicitó tu CV! (${safeNombre})`,
    text: `Nueva solicitud de CV:\n\nNombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa || 'No especificada'}\n\nEnviado desde tu Portfolio.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0914; color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(192, 132, 252, 0.2);">
        <h2 style="color: #facc15; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-top: 0;">
          📄 ¡Alguien acaba de solicitar tu CV!
        </h2>
        <p style="margin: 10px 0; font-size: 15px;"><strong>Nombre:</strong> ${safeNombre}</p>
        <p style="margin: 10px 0; font-size: 15px;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a></p>
        <p style="margin: 10px 0; font-size: 15px;"><strong>Empresa / Organización:</strong> ${safeEmpresa}</p>
        <p style="margin: 10px 0; font-size: 15px;"><strong>Fecha y Hora:</strong> ${new Date().toLocaleString('es-AR')}</p>
        <br />
        <div style="background: rgba(255, 255, 255, 0.05); padding: 14px; border-radius: 8px; border-left: 4px solid #facc15; font-size: 13px; color: #cbd5e1;">
          Esta persona completó el filtro y se le habilitó el acceso a tu currículum. Podés escribirle directamente a su correo haciendo clic en responder.
        </div>
      </div>
    `,
  };

  return await mailTransporter.sendMail(mailOptions);
};
