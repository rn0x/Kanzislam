import passwordHandler from '../modules/passwordHandler.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, generatePassword }) => {

    const Users = model.Users;

    app.get('/update-password', async (request, response) => {

        const email = request.query.email;
        const update_password = request.query.update_password;

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `تعيين كلمة المرور: استعادة حسابك بسهولة وأمان - ${config.WEBSITE_NAME}`,
            keywords: ["تعيين كلمة المرور", "استعادة حساب", "رابط تعيين إعادة كلمة المرور"],
            description: "صفحة رابط تعيين إعادة كلمة المرور توفر لك الوسيلة السهلة والآمنة لاستعادة حسابك في حال نسيت كلمة المرور الخاصة بك. اتبع الرابط الموجود في الصفحة لتعيين كلمة مرور جديدة والوصول إلى حسابك بسهولة ويسر.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`تعيين كلمة المرور: استعادة حسابك بسهولة وأمان`)}&description=${encodeURIComponent(`صفحة رابط تعيين إعادة كلمة المرور توفر لك الوسيلة السهلة والآمنة لاستعادة حسابك في حال نسيت كلمة المرور الخاصة بك. اتبع الرابط الموجود في الصفحة لتعيين كلمة مرور جديدة والوصول إلى حسابك بسهولة ويسر.`)}`,
            session: request.session,
            isUpdatePassword: true,
        };
        const pugPath = path.join(__dirname, './views/update_password.pug');

        if (email && update_password) {

            const existingEmail = await Users.findOne({
                where: { email },
            }).catch((error) => {
                console.log(error);
            });

            if (existingEmail?.dataValues?.email === email && existingEmail?.dataValues?.update_password === update_password) {

                options.isUpdatePassword = true;
                options.email = email;
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }

            else {
                options.isUpdatePassword = false;
                options.text = "عذرًا, رابط تعيين كلمة المرور غير صحيح او منتهي الصلاحية ❌";
                const render = pug.renderFile(pugPath, { options, jsStringify });
                response.send(render);
            }

        }

        else {
            options.isUpdatePassword = false;
            options.text = "عذرًا, لايمكن الوصول الى هذه الصفحة ❌";
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.status(400).send(render);
        }
    });

    app.post('/update-password', async (request, response) => {
        const { password, password_confirmation, email } = request.body;

        if (password && password_confirmation && email) {
            const generateUpdatePass = generatePassword(20);
            const { hashedPassword } = await passwordHandler(password, 'hash');
            await Users.update({ password: hashedPassword, update_password: generateUpdatePass }, {
                where: { email }
            }).catch((error) => {
                console.log(error);
            });
            response.json({
                message: "لقدم تم تعيين كلمة المرور الجديدة ✔️",
                isUpdatePass: true
            });
        }

        else {
            response.json({
                message: "عذرًا, لم يتم تعيين كلمة المرور الجديدة ❌",
                isUpdatePass: false
            });
        }
    });
}