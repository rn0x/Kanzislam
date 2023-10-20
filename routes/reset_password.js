export default async ({ app, pug, path, fs, config, __dirname, jsStringify, emailSender, model, generatePassword }) => {

    const Users = model.Users;

    app.get('/reset-password', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `استعادة كلمة المرور - ${config.WEBSITE_NAME}`,
            keywords: ["استعادة كلمة المرور", "pass", "reset password"],
            description: "صفحة توفر واجهة للمستخدمين لإعادة ضبط كلمة المرور الخاصة بهم في حال نسيانها أو فقدانها.",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session
        };
        let pugPath = path.join(__dirname, './views/reset_password.pug');
        let render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });

    app.post('/reset-password', async (request, response) => {

        const { email } = request.body;
        const existingEmail = await Users.findOne({
            where: { email },
        }).catch((error) => {
            console.log(error);
        });

        if (existingEmail?.dataValues?.email === email) {

            const generateUpdatePass = generatePassword(20);
            await Users.update({ update_password: generateUpdatePass }, {
                where: { email }
            }).catch((error) => {
                console.log(error);
            });
            const title = `رابط إستعادة كلمة المرور`;
            const message = `<p style="color: #484d8e; direction: rtl; text-align: center; font-weight: bold; ">
        مرحبا بك <span style="color: #da9945;">
            ${existingEmail?.dataValues?.name}
        </span> في منصة <span style="color: #da9945;">
            ${config?.WEBSITE_NAME}
        </span> <br> <br>
        لإستعادة كلمة المرور الخاصة بـ حسابك اضغط على الرابط التالي: <span style="background-color: #dfdfdf; padding: 10px; border-radius: 8px;">
            <a href="${config?.WEBSITE_DOMAIN}/update-password?email=${existingEmail?.dataValues?.email}&update_password=${generateUpdatePass}" target="_blank" style="color: #ff0000; text-decoration: none;">
                اضغط هنا
            </a>
        </span>
    </p>`;

            await emailSender.sendEmail({
                message,
                title,
                email,
            }).catch((error) => {
                console.log(error);
            });

            response.json({
                message: "تم إرسال رابط لإستعادة كلمة المرور الى البريد الإلكتروني الذي أدخلته",
                isResetPass: true
            });
        }

        else {
            response.json({
                message: "البريد الالكتروني الذي أدخلته غير صحيح",
                isResetPass: false
            });
        }
    });
}