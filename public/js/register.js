document.addEventListener('DOMContentLoaded', async function () {
    const options = window.options;

    if (options?.session?.isLoggedIn) {
        window.location.href = '/';
        return;
    }

    const registerButton = document.getElementById('registerButton');
    const verificationQuestion = document.querySelector('#verification_question p');
    const verification_question_input = document.getElementById('verification_question_input');
    const registerPage = document.getElementById('registerPage');
    const loading = document.getElementById('loading');
    const alertMessage = document.getElementById('alertMessage');

    registerPage.style.display = 'block';
    verificationQuestion.textContent = options?.randomQuestion?.question;
    verification_question_input.placeholder = `قم بالإجابة على سؤال التحقق ...(${options?.randomQuestion?.answer})`;

    let isRegisterd
    registerButton.addEventListener('click', async () => {
        if (isRegisterd) {
            return;
        }
        loading.style.display = 'block';
        const name = document.querySelector('#name input')?.value?.trim()?.toLocaleLowerCase();
        const username = document.querySelector('#username > input')?.value?.trim()?.toLocaleLowerCase();
        const email = document.querySelector('#email > input')?.value?.trim()?.toLocaleLowerCase();
        const password = document.querySelector('#password > input')?.value;
        const verificationAnswer = document.querySelector('#verification_question > input')?.value?.trim()?.toLocaleLowerCase();
        const checkTerms = document.getElementById('checkTerms');

        const nameMessage = document.querySelector('#name > small');
        const usernameMessage = document.querySelector('#username > small');
        const emailMessage = document.querySelector('#email > small');
        const passwordMessage = document.querySelector('#password > small');
        const verificationAnswerMessage = document.querySelector('#verification_question > small');
        const checkTermsMessage = document.getElementById('checkTermsMassage');

        nameMessage.style.display = 'none';
        usernameMessage.style.display = 'none';
        emailMessage.style.display = 'none';
        passwordMessage.style.display = 'none';
        verificationAnswerMessage.style.display = 'none';
        checkTermsMessage.style.display = 'none';

        function validateInputs(name, username, password, email, answer, checkTerms) {
            const errors = {};

            if (!name || name.length < 5) {
                errors.name = "يجب أن يكون طول الاسم 5 أحرف أو أكثر";
            }

            if (name && name.length > 30) {
                errors.name = "يجب ألا يتجاوز طول الاسم 30 حرفًا";
            }

            if (!username || username.length < 5) {
                errors.username = "يجب أن يكون طول اسم المستخدم 5 أحرف أو أكثر";
            }

            if (username && username.length > 15) {
                errors.username = "يجب ألا يتجاوز طول اسم المستخدم 15 حرفًا";
            }

            if (!password || password.length < 8) {
                errors.password = "يجب أن يكون طول كلمة المرور 8 أحرف أو أكثر";
            }

            if (password && password.length > 30) {
                errors.password = "يجب ألا يتجاوز كلمة المرور 30 حرفًا";
            }

            if (email && email.length > 35) {
                errors.email = "يجب ألا يتجاوز طول البريد الإلكتروني 35 حرفًا";
            }

            if (!email && email.length === 0) {
                errors.email = "قم بإداخل البريد الإلكتروني";
            }

            if (answer && answer.length > 20) {
                errors.answer = "يجب ألا يتجاوز طول إجابة التحقق 20 حرفًا";
            }

            if (!answer && answer.length === 0) {
                errors.answer = "قم بالإجابة على سؤال التحقق";
            }

            if (!checkTerms?.checked) {
                errors.checkTerms = `لم تقم بالموافقة على شروط استخدام ${options.website_name}`
            }

            const isEnglish = /^[a-zA-Z0-9]*$/;
            if (username && !isEnglish.test(username)) {
                errors.username = "يجب أن يحتوي اسم المستخدم على أحرف وأرقام إنجليزية فقط";
            }

            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !isEmailValid.test(email)) {
                errors.email = "البريد الإلكتروني غير صالح";
            }

            if (Object.keys(errors).length === 0) {
                return {
                    isCheckInput: true
                };
            } else {
                return {
                    isCheckInput: false,
                    ...errors
                };
            }
        }

        const validation = validateInputs(name, username, password, email, verificationAnswer, checkTerms);

        if (!validation.isCheckInput) {
            if (validation.name) {
                nameMessage.textContent = validation.name;
                nameMessage.style.display = 'block';
                nameMessage.style.scrollMarginTop = "150px";
                nameMessage.scrollIntoView();
                setTimeout(() => {
                    nameMessage.style.display = 'none';
                }, 30000);
            }

            if (validation.username) {
                usernameMessage.textContent = validation.username;
                usernameMessage.style.display = 'block';
                usernameMessage.style.scrollMarginTop = "150px";
                usernameMessage.scrollIntoView();
                setTimeout(() => {
                    usernameMessage.style.display = 'none';
                }, 30000);
            }

            if (validation.email) {
                emailMessage.textContent = validation.email;
                emailMessage.style.display = 'block';
                emailMessage.style.scrollMarginTop = "150px";
                emailMessage.scrollIntoView();
                setTimeout(() => {
                    emailMessage.style.display = 'none';
                }, 30000);
            }

            if (validation.password) {
                passwordMessage.textContent = validation.password;
                passwordMessage.style.display = 'block';
                passwordMessage.style.scrollMarginTop = "150px";
                passwordMessage.scrollIntoView();
                setTimeout(() => {
                    passwordMessage.style.display = 'none';
                }, 30000);
            }

            if (validation.answer) {
                verificationAnswerMessage.textContent = validation.answer;
                verificationAnswerMessage.style.display = 'block';
                verificationAnswerMessage.style.scrollMarginTop = "150px";
                verificationAnswerMessage.scrollIntoView();
                setTimeout(() => {
                    verificationAnswerMessage.style.display = 'none';
                }, 30000);
            }

            if (!checkTerms?.checked) {
                checkTermsMessage.textContent = validation.checkTerms;
                checkTermsMessage.style.display = 'block';
                checkTermsMessage.style.scrollMarginTop = "150px";
                checkTermsMessage.scrollIntoView();
                setTimeout(() => {
                    checkTermsMessage.style.display = 'none';
                }, 30000);
            }
        }

        else {
            const registerURL = window.location.href;
            const registerFetch = await fetch(registerURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    email,
                    question: options?.randomQuestion?.question,
                    answer: verificationAnswer,
                    checkTerms: checkTerms.checked,
                }),
            });

            const response = await registerFetch.json();

            if (response?.register) {
                isRegisterd = true;
                registerButton.style.display = "none";
                alertMessage.innerText = "أهلاً وسهلاً بك! لقد تم تسجيل حسابك بنجاح. قمنا بإرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى النقر على الرابط الموجود في الرسالة لتفعيل حسابك";
                alertMessage.style.display = "block";
                alertMessage.style.scrollMarginTop = "150px";
                alertMessage.scrollIntoView();

                setTimeout(() => {
                    window.location.href = '/';
                }, 10000);
            }

            if (response?.isError) {
                window.location.href = '/register';
            }

            if (response?.usernameFind) {
                usernameMessage.textContent = 'عذرًا، اسم المستخدم محجوز بالفعل. يرجى اختيار اسم مستخدم آخر.';
                usernameMessage.style.display = 'block';
                usernameMessage.style.scrollMarginTop = "150px";
                usernameMessage.scrollIntoView();
                setTimeout(() => {
                    usernameMessage.style.display = 'none';
                }, 30000);
            }

            if (response?.emailFind) {
                emailMessage.textContent = "عذرًا، البريد الإلكتروني الذي قمت بإدخاله مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر لإكمال عملية التسجيل.";
                emailMessage.style.display = 'block';
                emailMessage.style.scrollMarginTop = "150px";
                emailMessage.scrollIntoView();
                setTimeout(() => {
                    emailMessage.style.display = 'none';
                }, 30000);
            }

            if (!response?.verification_answer) {
                verificationAnswerMessage.textContent = "عذراً, الإجابة خاطئة";
                verificationAnswerMessage.style.display = 'block';
                verificationAnswerMessage.style.scrollMarginTop = "150px";
                verificationAnswerMessage.scrollIntoView();
                setTimeout(() => {
                    verificationAnswerMessage.style.display = 'none';
                }, 30000);
            }
        }
        loading.style.display = 'none';
    });
});