import nodemailer from 'nodemailer';

class EmailSender {
    constructor(config) {
        this.user = config?.user;
        this.displayname = config?.displayname;
        this.transporter = nodemailer.createTransport({
            host: config?.host,
            port: config?.port,
            secure: false,
            auth: {
                user: config?.user,
                pass: config?.pass
            }
        });
    }

    async sendEmail(options) {
        try {
            if (!this.validateEmail(options?.email)) {
                throw new Error('بريد إلكتروني غير صالح');
            }

            const mailOptions = {
                from: {
                    name: this.displayname,
                    address: this.user
                },
                to: options?.email,
                subject: options?.title,
                text: options?.message,
                html: options?.message
            };

            let verify = await this.transporter.verify();

            if (verify) {

                await this.transporter.sendMail(mailOptions);

                return {
                    message: options?.message,
                    title: options?.title,
                    email: options?.email
                };
            }
        } catch (error) {
            console.error('حدث خطأ أثناء إرسال الرسالة:', error.message);
            throw error;
        }
    }

    validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}

export default EmailSender;