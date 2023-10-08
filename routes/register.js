export default async (param) => {

    const { app, pug, path, fs, config, __dirname, jsStringify, database } = param;
    let User = database.User

    app.post('/register', async (request, response) => {

        const { name, username, password, email, question, verification_question, checkTerms } = request.body;
        let verification_q = verification_question === 'الله' ? true : false
        if (name && username && password && email && verification_q && checkTerms) {

            let GetUser = await User.findOne({
                where: { username: username }
            }).catch((error) => {
                console.error('حدث خطأ أثناء التحقق من إسم المستخدم: ', error);
            });

            if (GetUser?.dataValues?.username === username) {

                response.json({
                    massage: 'عذرًا، اسم المستخدم محجوز بالفعل. يرجى اختيار اسم مستخدم آخر.',
                    register: false,
                    usernameFind: true,
                    verification_question: verification_q

                });
            }
            else {
                await User.create({
                    name: name,
                    username: username,
                    password: password,
                    email: email,
                    type: "member"
                }).catch((error) => {
                    console.error('حدث خطأ أثناء إنشاء حساب المستخدم: ', error);
                });

                response.json({
                    massage: 'تم تسجيل حساب جديد . يمكنك الآن الاستفادة من جميع المزايا والخدمات المتاحة في الموقع. نرحب بك في مجتمعنا ونأمل أن تستمتع بتجربتك معنا.',
                    register: true,
                    verification_question: verification_q

                });
            }

        }

        else {
            response.json({
                massage: 'يرجى إكمال جميع الفراغات المطلوبة لتسجيل الحساب الجديد',
                register: false,
                verification_question: verification_q
            });
        }

    });

    app.get('/register', async (request, response) => {

        let options = {
            website_name: config.WEBSITE_NAME,
            title: `عنوان الصفحة - ${config.WEBSITE_NAME}`,
            keywords: ["word1", "word2", "word3"],
            description: "وصف_الصفحة",
            preview: "صورة_المعاينة_للصفحة",
            session: request.session,
            question: "من هو ربك ؟"
        };
        let pugPath = path.join(__dirname, './views/register.pug');
        let render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}