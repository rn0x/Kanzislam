document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const storage = window.localStorage;
    const alertEl = document.getElementById("alert");
    const loginbox = document.getElementById("loginbox");
    const loggedIn_bt = document.getElementById("loggedIn_bt");
    const loginusername = document.querySelector("#loginusername > input");
    const loginusername_massage = document.querySelector("#loginusername > small");
    const loginpassword = document.querySelector("#loginpassword > input");
    const getLoginPath = storage.getItem("login-path");

    if (options?.session?.isLoggedIn) {
        alertEl.innerText = "لقد قمت بتسجيل الدخول بالفعل!"
        alertEl.style.background = "#d1fad1";
        alertEl.style.display = "block";
        alertEl.style.scrollMarginTop = "150px";
        setTimeout(() => {
            window.location.href = "/";
        }, 5000);

        return;
    }

    else {

        let loggedIn = false;
        loginbox.style.display = "block";
        loggedIn_bt.addEventListener("click", async () => {

            if (loggedIn) {
                return;
            }
            if (loginusername?.value?.length < 5) {
                alertEl.innerText = "يجب أن يكون طول اسم المستخدم 5 أحرف أو أكثر";
                alertEl.style.display = "block";
                alertEl.style.scrollMarginTop = "150px";
                alertEl.scrollIntoView();
                loginusername_massage.style.display = "block";
                return
            }

            if (loginpassword?.value?.length < 8) {
                alertEl.innerText = "يجب أن يكون طول كلمة المرور 8 أحرف أو أكثر";
                alertEl.style.display = "block";
                alertEl.style.scrollMarginTop = "150px";
                alertEl.scrollIntoView();
                loginusername_massage.style.display = "block";
                return
            }

            let loginURL = window.location.href;
            let loginFetch = await fetch(loginURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginusername?.value?.trim()?.toLocaleLowerCase(),
                    password: loginpassword?.value
                }),
            });
            let response = await loginFetch?.json();

            if (response?.logged_in) {
                loggedIn = true;
                console.log(getLoginPath);
                window.location.href = getLoginPath;
            }
            else if (response?.locked) {

                alertEl.innerText = response?.massage;
                alertEl.style.display = "block";
                alertEl.style.scrollMarginTop = "150px";
                alertEl.scrollIntoView();
                loginusername_massage.style.display = "block";
            }
            else {
                alertEl.innerText = "بيانات الدخول غير صحيحة يرجى التأكد من البيانات وإعادة المحاولة"
                alertEl.style.display = "block";
                alertEl.style.scrollMarginTop = "150px";
                alertEl.scrollIntoView();
                loginusername_massage.style.display = "block";
            }
        });
    }
});