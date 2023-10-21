import passwordHandler from '../modules/passwordHandler.js';

export default async ({
    app,
    pug,
    path,
    fs,
    config,
    __dirname,
    jsStringify,
    model,
    emailSender,
    generatePassword,
    checkTextLength,
}) => {
    const Users = model.Users;

    const handleRegistration = async (request, response) => {
        try {
            const {
                name,
                username,
                password,
                email,
                question,
                answer,
                checkTerms,
            } = request.body;

            const { answer: correctAnswer } = await getAnswerData(question).catch((error) => {
                console.log(error);
            });
            const isAnswerCorrect = answer === correctAnswer;

            const existingUser = await Users.findOne({
                where: { username },
            }).catch((error) => {
                console.log(error);
            });

            const existingEmail = await Users.findOne({
                where: { email },
            }).catch((error) => {
                console.log(error);
            });

            if (existingUser?.dataValues?.username === username) {
                return response.status(400).json({
                    message:
                        'عذرًا، اسم المستخدم محجوز بالفعل. يرجى اختيار اسم مستخدم آخر.',
                    register: false,
                    usernameFind: true,
                    verification_answer: isAnswerCorrect,
                });
            } else if (existingEmail?.dataValues?.email === email) {
                return response.status(400).json({
                    message:
                        'عذرًا، البريد الإلكتروني الذي قمت بإدخاله مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر لإكمال عملية التسجيل.',
                    register: false,
                    emailFind: true,
                    verification_answer: isAnswerCorrect,
                });
            } else if (!isAnswerCorrect) {
                return response.status(400).json({
                    message: 'عذراً, الإجابة خاطئة',
                    register: false,
                    verification_answer: isAnswerCorrect,
                });
            } else if (
                name &&
                username &&
                password &&
                email &&
                isAnswerCorrect &&
                checkTerms
            ) {
                const verification_code = generatePassword(10);
                const token = generatePassword(30);
                const title = `رمز التحقق الخاص بتفعيل حسابك`;
                const message = `<p style="color: #484d8e; direction: rtl; text-align: center; font-weight: bold; ">
        مرحبا بك <span style="color: #da9945;">
            ${name}
        </span> في منصة <span style="color: #da9945;">
            ${config?.WEBSITE_NAME}
        </span> <br> <br>
        لتفعيل حسابك اضغط على الرابط التالي: <span style="background-color: #dfdfdf; padding: 10px; border-radius: 8px;">
            <a href="${config?.WEBSITE_DOMAIN}/activate?username=${username}&verification_code=${verification_code}" target="_blank" style="color: #ff0000; text-decoration: none;">
                اضغط هنا
            </a>
        </span>
    </p>`;
                await emailSender.sendEmail({
                    message,
                    title,
                    email,
                }).catch((error) => {
                    console.log('حدث خطأ, يرجى التحقق من بينات SMTP', error);
                });
                const lastUserId = await Users.max('user_id').catch((error) => {
                    console.log('حدث خطأ:', error);
                });
                const newUserId = lastUserId + 1;
                const { hashedPassword } = await passwordHandler(password, 'hash');
                await Users.create({
                    user_id: newUserId,
                    name: name?.toLocaleLowerCase(),
                    username: username?.toLocaleLowerCase(),
                    password: hashedPassword,
                    email: email?.toLocaleLowerCase(),
                    type: 'member',
                    verification_code,
                    isActivated: false,
                    isBlocked: false,
                    token,
                }).catch((error) => {
                    console.log(error);
                });

                return response.json({
                    message:
                        'تم تسجيل حساب جديد. يمكنك الآن الاستفادة من جميع المزايا والخدمات المتاحة في الموقع. نرحب بك في مجتمعنا ونأمل أن تستمتع بتجربتك معنا.',
                    register: true,
                    verification_answer: isAnswerCorrect,
                });
            } else {
                return response.status(400).json({
                    message:
                        'يرجى إكمال جميع الفراغات المطلوبة لتسجيل الحساب الجديد',
                    register: false,
                    verification_answer: isAnswerCorrect,
                });
            }
        } catch (error) {
            console.error('حدث خطأ : ', error);
            return response.status(500).json({
                message: `حدث خطأ\n\n${error}`,
                register: false,
                verification_answer: true,
                isError: true,
            });
        }
    };

    const handleRegistrationPage = async (request, response) => {
        const randomQuestion = await getRandomQuestionData().catch((error) => {
            console.log(error);
        });
        const options = {
            website_name: config.WEBSITE_NAME,
            title: `تسجيل حساب جديد - انضم إلينا الآن - ${config.WEBSITE_NAME}`,
            keywords: ['تسجيل حساب جديد', 'صفحة التسجيل', 'انضم إلينا', 'إنشاء حساب جديد'],
            description: 'تسجيل حساب جديد - انضم إلى مجتمعنا واحصل على حساب جديد بسهولة. قم بإنشاء حساب جديد باستخدام معلوماتك الشخصية واستفد من محتوى مميز وتفاعل مع أعضاء آخرين.',
            preview: 'صورة_المعاينة_للصفحة',
            session: request.session,
            randomQuestion: randomQuestion,
        };
        const pugPath = path.join(__dirname, './views/register.pug');
        const render = pug.renderFile(pugPath, { options, jsStringify });
        response.send(render);
    };

    app.post('/register', handleRegistration);
    app.get('/register', handleRegistrationPage);

    const getRandomQuestionData = async () => {
        const VerificationDataPath = path.join(__dirname, 'VerificationData.json');
        const VerificationData = await fs.readJson(VerificationDataPath).catch(
            () => ({})
        );
        const randomIndex = Math.floor(Math.random() * VerificationData.length);
        return VerificationData[randomIndex];
    };

    const getAnswerData = async (Question) => {
        const VerificationDataPath = path.join(__dirname, 'VerificationData.json');
        const VerificationData = await fs.readJson(VerificationDataPath).catch(
            () => ({})
        );
        const findQuestion = VerificationData.find((e) => e.question === Question);
        return findQuestion;
    };
};  