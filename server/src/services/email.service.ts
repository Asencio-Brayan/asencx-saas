import nodemailer from 'nodemailer';
import { Lead } from '@prisma/client';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendLeadNotification = async (lead: Lead) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.warn('ADMIN_EMAIL not set, skipping email notification');
        return;
    }

    // Encode message for WhatsApp
    // Format: "Hola [Name], recibimos tu solicitud..."
    const message = `Hola ${lead.name}, recibimos tu solicitud de prueba gratis para ${lead.companyName}. ¿En qué podemos ayudarte?`;
    const whatsappLink = `https://wa.me/${lead.phoneWhatsapp}?text=${encodeURIComponent(message)}`;

    const mailOptions = {
        from: '"AsencX System" <no-reply@asencx.com>',
        to: adminEmail,
        subject: `New Lead: ${lead.companyName}`,
        html: `
      <h2>New Lead Registered</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Company:</strong> ${lead.companyName}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>WhatsApp:</strong> ${lead.phoneWhatsapp}</p>
      <p><strong>Created At:</strong> ${lead.createdAt}</p>
      <br />
      <a href="${whatsappLink}" style="background-color:#25D366;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Chat on WhatsApp
      </a>
      <p>Or click here: <a href="${whatsappLink}">${whatsappLink}</a></p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
