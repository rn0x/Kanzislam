document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const ButtonSend = document.getElementById("ButtonSend");
    const alertMessage = document.getElementById("alertMessage");
    const inputEmail = document.getElementById("inputEmail");
    const loading = document.getElementById("loading");

    if (options?.session?.isLoggedIn) {

        alertMessage.style.display = "block";
        alertMessage.innerText = "اولاً قم بتسجيل الخروج من حسابك الحالي ❌";
        setTimeout(() => {
            window.location.href = "/";
        }, 5000);

        return;
    }

    else {
        let reset_password = false;
        ButtonSend.addEventListener("click", async () => {
            if (reset_password) {
                return;
            }
            const inputEmailMessage = document.getElementById("inputEmailMessage");
            const email = inputEmail.value;
            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email && isEmailValid.test(email)) {

                loading.style.display = "block";
                let resetPassURL = `${window.location.origin}/reset-password`;
                let resetPassFetch = await fetch(resetPassURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email?.trim()?.toLocaleLowerCase(),
                    }),
                });
                let response = await resetPassFetch?.json();

                if (response?.isResetPass) {
                    reset_password = true;
                    alertMessage.style.display = "block";
                    alertMessage.style.backgroundColor = "#d2fad1";
                    alertMessage.style.borderColor = "#96e296";
                    alertMessage.innerText = " تم ارسال رسالة الى بريدك الالكتروني، يرجى اتباع التعليمات لاستعادة كلمة المرور الخاصة بك";

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 7000);

                }

                else {
                    alertMessage.style.display = "block";
                    inputEmailMessage.style.display = "block";
                    inputEmail.style.borderColor = "#ff4646";

                    setTimeout(() => {
                        alertMessage.style.display = "none";
                        inputEmailMessage.style.display = "none";
                        inputEmail.style.borderColor = "";
                    }, 15000);
                }

                loading.style.display = "none";
            }

            else {
                alertMessage.style.display = "block";
                inputEmailMessage.style.display = "block";
                inputEmail.style.borderColor = "#ff4646";

                setTimeout(() => {
                    alertMessage.style.display = "none";
                    inputEmailMessage.style.display = "none";
                    inputEmail.style.borderColor = "";
                }, 15000);
            }
        });
    }
});