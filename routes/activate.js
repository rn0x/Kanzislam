export default async ({ app, pug, path, fs, config, __dirname, jsStringify, database }) => {

    app.get('/activate', async (request, response) => {

        const User = database.User;
        const username = request.query.username;
        const verification_code = request.query.verification_code;

        if (username && verification_code) {

            try {

                const existingUser = await User.findOne({
                    where: { username },
                });

                if (existingUser?.dataValues?.verification_code === verification_code) {

                    if (!existingUser?.dataValues?.isActivated) {
                        await User.update({ isActivated: true }, {
                            where: { username }
                        });
                        let options = {
                            website_name: config.WEBSITE_NAME,
                            title: `تفعيل الحساب - ${config.WEBSITE_NAME}`,
                            keywords: ["تفعيل الحساب", "تنشيط الحساب"],
                            description: "صفحة تفعيل الحساب الخاص بك على المنصة",
                            preview: "صورة_المعاينة_للصفحة",
                            session: request.session,
                            isActivated: true,
                            text: 'تم تفعيل الحساب ✔️'
                        };
                        let pugPath = path.join(__dirname, './views/activate.pug');
                        let render = pug.renderFile(pugPath, { options, jsStringify });
                        response.send(render);
                    }

                    else {
                        let options = {
                            website_name: config.WEBSITE_NAME,
                            title: `تفعيل الحساب - ${config.WEBSITE_NAME}`,
                            keywords: ["تفعيل الحساب", "تنشيط الحساب"],
                            description: "صفحة تفعيل الحساب الخاص بك على المنصة",
                            preview: "صورة_المعاينة_للصفحة",
                            session: request.session,
                            isActivated: true,
                            text: 'لقد قمت من قبل بتفعيل الحساب ✔️'

                        };
                        let pugPath = path.join(__dirname, './views/activate.pug');
                        let render = pug.renderFile(pugPath, { options, jsStringify });
                        response.send(render);
                    }

                }

                else {
                    let options = {
                        website_name: config.WEBSITE_NAME,
                        title: `تفعيل الحساب - ${config.WEBSITE_NAME}`,
                        keywords: ["تفعيل الحساب", "تنشيط الحساب"],
                        description: "صفحة تفعيل الحساب الخاص بك على المنصة",
                        preview: "صورة_المعاينة_للصفحة",
                        session: request.session,
                        isActivated: false,
                        text: 'رابط تفعيل العضوية غير صحيح ❌'

                    };
                    let pugPath = path.join(__dirname, './views/activate.pug');
                    let render = pug.renderFile(pugPath, { options, jsStringify });
                    response.send(render);
                }

            } catch (error) {

                console.error('حدث خطأ : ', error);
                let options = {
                    website_name: config.WEBSITE_NAME,
                    title: `تفعيل الحساب - ${config.WEBSITE_NAME}`,
                    keywords: ["تفعيل الحساب", "تنشيط الحساب"],
                    description: "صفحة تفعيل الحساب الخاص بك على المنصة",
                    preview: "صورة_المعاينة_للصفحة",
                    session: request.session,
                    isActivated: false,
                    isError: true,
                    text: `حدث خطأ\n\n${error} ❌`

                };
                let pugPath = path.join(__dirname, './views/activate.pug');
                let render = pug.renderFile(pugPath, { options, jsStringify });
                response.status(500).send(render);
            }
        }

        else {
            let options = {
                website_name: config.WEBSITE_NAME,
                title: `تفعيل الحساب - ${config.WEBSITE_NAME}`,
                keywords: ["تفعيل الحساب", "تنشيط الحساب"],
                description: "صفحة تفعيل الحساب الخاص بك على المنصة",
                preview: "صورة_المعاينة_للصفحة",
                session: request.session,
                isActivated: false,
                text: 'رابط تفعيل العضوية غير صحيح ❌'
            };
            let pugPath = path.join(__dirname, './views/activate.pug');
            let render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }

    });
}