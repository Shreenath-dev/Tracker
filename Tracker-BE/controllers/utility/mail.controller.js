import nodemailer from "nodemailer";
import config from "@/config";
import { EmailTemplate } from "@/models";
import isEmpty from "is-empty";

const sendEmail = async (toEmail, content, attachment = []) => {
    try {
        const { subject, template } = content;
        console.log("Email content:",config.EMAIL_USERNAME,config.EMAIL_PASSWORD) 
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com", 
            port: 587,
            secure: false, 
            auth: {
                user: "shreenathsubramani28@gmail.com",
                pass: config.EMAIL_PASSWORD
            },
            family: 4
        });

        const mailOptions = await transport.sendMail({
            from: config.EMAIL_USERNAME,
            to: toEmail,
            subject,
            html: template,
            attachments: attachment
        });
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

export const sendEmailWithTemplate = async ({ identifier, to, content, attachment = [] }) => {
    try {
        const template = await EmailTemplate.findOne({ identifier });

        if (isEmpty(template)) {
            return false;
        }

        if (template.status === "inactive" || template.status === " inactive") {
            return false;
        }

        let htmlBody = template.body;
        const subject = template.subject;

        if (identifier === "EMAIL_VERIFY_OTP" && content.otp) {
            htmlBody = htmlBody.replace(/{{otp}}/gi, content.otp);
        }

        const mailContent = { "subject": subject, "template": htmlBody };

        return await sendEmail(to, mailContent, attachment);
    }
    catch (error) {
        console.error("Error in sendEmailWithTemplate:", error);
        return false;
    }
}