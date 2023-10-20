export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, generatePassword }) => {

    const Users = model.Users;

    app.get('/update-password', async (request, response) => {

        const email = request.query.email;
        const update_password = request.query.update_password;

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
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
            await Users.update({ password: password, update_password: generateUpdatePass }, {
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