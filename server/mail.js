const nodemailer = require("nodemailer");
const config = require("./config");

let transport = null;

function getTransport() {
    if (!transport) {
        transport = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: config.SMTP_PORT === 465,
            auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined,
        });
    }
    return transport;
}

// Возвращает { sent: boolean }. Ошибки SMTP не пробрасываются наружу:
// вызывающий код решает, что делать, если письмо не ушло.
async function sendConfirmation({ to, name, code, link }) {
    const subject = "Confirm your email";
    const text = [
        `Hi ${name},`,
        "",
        "Confirm your email to finish signing up.",
        `Code: ${code}`,
        `Or open this link: ${link}`,
        "",
        "The code expires in 30 minutes.",
    ].join("\n");

    if (!config.SMTP_HOST) {
        console.log(`Email confirmation for ${to}\n${text}`);
        return { sent: false };
    }

    try {
        const info = await getTransport().sendMail({ from: config.MAIL_FROM, to, subject, text });
        return { sent: info.accepted.length > 0 };
    } catch (error) {
        console.error("SMTP error:", {
            message: error.message,
            code: error.code,
            response: error.response,
        });
        return { sent: false, error: true };
    }
}

module.exports = { sendConfirmation };
