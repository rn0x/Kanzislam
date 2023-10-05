document.addEventListener("DOMContentLoaded", async function (e) {
    e.preventDefault()
    const options = window.options;

    if (options?.session?.isLoggedIn) {
        window.location.href = "/";
        return;
    }

    else {

        let registerButton = document.getElementById("registerButton");
        let verification_question = document.querySelector("#verification_question p");
        let registerPage = document.getElementById("registerPage");

        registerPage.style.display = "block";
        verification_question.textContent = options?.question;
        registerButton.addEventListener("click", async (e) => {
            let name = document.querySelector('#name input');
            let nameMassage = document.querySelector("#name > small");
            let username = document.querySelector("#username > input");
            let usernameMassage = document.querySelector("#username > small");
            let email = document.querySelector("#email > input");
            let emailMassage = document.querySelector("#email > small");
            let password = document.querySelector("#password > input");
            let passwordMassage = document.querySelector("#password > small");
            let verification_question_value = document.querySelector("#verification_question > input");
            let verification_question_value_massage = document.querySelector("#verification_question > small");
            let checkTerms = document.getElementById("checkTerms");
            let checkTermsMassage = document.getElementById("checkTermsMassage");

            let registerURL = window.location.href;
            let registerFetch = await fetch(registerURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name?.value?.trim()?.toLocaleLowerCase(),
                    username: username?.value?.trim()?.toLocaleLowerCase(),
                    password: password?.value,
                    email: email?.value?.trim()?.toLocaleLowerCase(),
                    question: options?.question,
                    verification_question: verification_question_value?.value?.trim()?.toLocaleLowerCase(),
                    checkTerms: checkTerms?.checked,
                }),
            });
            let response = await registerFetch?.json();

            if (name?.value?.length < 5) {
                nameMassage.textContent = 'الاسم الذي أدخلته قصير جداً. 5 أحرف هو الحد الأدنى'
                nameMassage.style.display = 'block'
                setTimeout(() => {
                    nameMassage.style.display = 'none'
                }, 15000);
            }

            if (username?.value?.length < 3 || response?.usernameFind) {

                if (username?.value?.length < 3) {
                    usernameMassage.textContent = 'الاسم الذي أدخلته قصير جداً. 3 أحرف هو الحد الأدنى';
                }

                else {
                    usernameMassage.textContent = response?.massage;
                }

                usernameMassage.style.display = 'block'
                setTimeout(() => {
                    usernameMassage.style.display = 'none'
                }, 15000);

            }

            if (email?.value?.length < 5) {
                emailMassage.textContent = email?.textContent?.length === 0 ? 'لم تدخل بريدك الالكتروني بعد' : 'البريد الالكتروني الذي أدخلته غير صحيح'
                emailMassage.style.display = 'block'
                setTimeout(() => {
                    emailMassage.style.display = 'none'
                }, 15000);
            }

            if (password?.value?.length < 8) {
                passwordMassage.textContent = 'كلمة المرور التي اخترتها ضعيفة. اختر كلمة مرور مؤلفة من 8 أحرف على الأقل'
                passwordMassage.style.display = 'block'
                setTimeout(() => {
                    passwordMassage.style.display = 'none'
                }, 15000);
            }

            console.log(response?.verification_question);
            if (verification_question_value?.value?.length === 0 || !response?.verification_question) {

                if (verification_question_value?.value?.length === 0) {
                    verification_question_value_massage.textContent = 'لم تقم بكتابة إجابة !';
                }

                else {
                    verification_question_value_massage.textContent = 'الإجابة خاطئة';
                }
                verification_question_value_massage.style.display = 'block'
                setTimeout(() => {
                    verification_question_value_massage.style.display = 'none'
                }, 15000);
            }

            if (!checkTerms?.checked) {
                checkTermsMassage.style.display = 'block'
                setTimeout(() => {
                    checkTermsMassage.style.display = 'none'
                }, 15000);
            }

        });

    }
});