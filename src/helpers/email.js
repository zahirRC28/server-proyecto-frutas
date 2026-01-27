const nodemailer = require('nodemailer');
require('dotenv').config();

const enviarCorreo = async ({ correo, asunto, textoPlano, textoHTML, archivosAdjuntos = [] }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: `"Mi App" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: asunto,
        text: textoPlano,
        html: textoHTML,
        attachments: archivosAdjuntos
    });

    return info;
};

module.exports = { enviarCorreo };
