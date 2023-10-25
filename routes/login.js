import passwordHandler from '../modules/passwordHandler.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model }) => {

    let Users = model.Users

    app.post('/login', async (request, response) => {

        const { username, password } = request.body;
        let GetUser = await Users.findOne({
            where: { username: username }
        }).catch((error) => {
            console.log(error);
        });
        const getPass = GetUser?.dataValues?.password;
        // مقارنة كلمة المرور
        const { isMatch } = await passwordHandler({ hashedPassword: getPass, plainPassword: password }, 'compare');

        // تعيين متغير لتتبع عدد مرات إدخال بيانات غير صحيحة
        let loginAttempts = request.session.loginAttempts || 0;

        // تحقق من عدد مرات إدخال بيانات غير صحيحة والوقت الحالي
        if (loginAttempts >= 5) {
            const lockedUntil = request.session.lockedUntil || 0;
            const currentTime = Date.now();

            // تحقق من وقت انتهاء فترة القفل
            if (currentTime < lockedUntil) {
                const remainingTime = Math.ceil((lockedUntil - currentTime) / 1000 / 60);
                response.json({ logged_in: false, locked: true, massage: `لقد تجاوزت الحد المسموح لمحاولات تسجيل الدخول. الرجاء المحاولة مرة أخرى بعد ${remainingTime} دقيقة.` });
                return;
            } else {
                // إعادة ضبط عدد مرات إدخال بيانات غير صحيحة بعد انتهاء فترة القفل
                request.session.loginAttempts = 0;
                request.session.lockedUntil = 0;
            }
        }

        // قم بتنفيذ عملية التحقق من بيانات تسجيل الدخول والتحقق من صحتها
        if (GetUser?.dataValues?.username === username && isMatch) {
            // إعادة ضبط عدد مرات إدخال بيانات غير صحيحة في حالة النجاح
            request.session.loginAttempts = 0;
            request.session.lockedUntil = 0;

            // قم بتعيين متغير الجلسة للإشارة إلى أن المستخدم مسجل دخولًا
            request.session.isLoggedIn = true;
            request.session.username = username;
            request.session.user_id = GetUser?.dataValues?.user_id;
            response.json({ logged_in: true, massage: 'تم تسجيل الدخول بنجاح!' });
        } else {
            // زيادة عدد مرات إدخال بيانات غير صحيحة في حالة الفشل
            request.session.loginAttempts = loginAttempts + 1;
            request.session.isLoggedIn = false;
            // تحديد وقت انتهاء فترة القفل (نصف ساعة)
            const lockDuration = 30 * 60 * 1000; // بالمللي ثانية
            const lockedUntil = Date.now() + lockDuration;
            request.session.lockedUntil = lockedUntil;

            response.json({ logged_in: false, massage: 'فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.' });
        }
    });


    app.get('/login', async (request, response) => {

        const options = {
            website_name: config.WEBSITE_NAME,
            title: `تسجيل الدخول إلى حسابك - ${config.WEBSITE_NAME}`,
            keywords: ["تسجيل الدخول", "صفحة تسجيل الدخول", "حساب المستخدم", "اسم المستخدم", "كلمة المرور", "الوصول إلى الحساب", "الأمان", "المحتوى الحصري", "الاعتمادات"],
            description: "صفحة تسجيل الدخول هي الصفحة التي يستخدمها المستخدمون للوصول إلى حساباتهم على الموقع. توفر الصفحة واجهة بسيطة وآمنة لإدخال معلومات الاعتماد الخاصة بهم، مثل اسم المستخدم وكلمة المرور، للوصول إلى المحتوى الحصري أو لإجراء أي نشاط يتطلب تسجيل الدخول.",
            preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent("تسجيل الدخول إلى حسابك")}&description=${encodeURIComponent("صفحة تسجيل الدخول هي الصفحة التي يستخدمها المستخدمون للوصول إلى حساباتهم على الموقع. توفر الصفحة واجهة بسيطة وآمنة لإدخال معلومات الاعتماد الخاصة بهم، مثل اسم المستخدم وكلمة المرور، للوصول إلى المحتوى الحصري أو لإجراء أي نشاط يتطلب تسجيل الدخول.")}`,
            session: request.session
        };
        const pugPath = path.join(__dirname, './views/login.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    });
}