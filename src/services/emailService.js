import nodemailer from 'nodemailer';
export const sendNotificationEmail = async ({ nombre, email, mensaje }) => {
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('ℹ️ [Email]: Modo local. Mensaje guardado en Supabase, pero falta configurar EMAIL_USER y EMAIL_PASS en .env para el envío real.');
    return { sent: false, reason: 'credentials_missing' };
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, 
    replyTo: email,
    subject: ` Nuevo mensaje en tu Portfolio de ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0b0914; color: #f3f4f6; padding: 25px; border-radius: 12px;">
        <h2 style="color: #c084fc; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          ✨ ¡Nuevo mensaje de contacto!
        </h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
        <p><strong>Mensaje:</strong></p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 4px solid #a855f7; font-style: italic;">
          "${mensaje}"
        </div>
        <br />
        <small style="color: #94a3b8;">Recibido desde tu Portfolio Web.</small>
      </div>
    `,
  };
  return await transporter.sendMail(mailOptions);
};
