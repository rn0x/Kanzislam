document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    let alertEl = document.getElementById("alert");
    let loginbox = document.getElementById("loginbox");
    let loggedIn_bt = document.getElementById("loggedIn_bt");
    let loginusername = document.querySelector("#loginusername > input");
    let loginusername_massage = document.querySelector("#loginusername > small");
    let loginpassword = document.querySelector("#loginpassword > input");

    if (options?.session?.isLoggedIn) {
        alertEl.innerText = "لقد قمت بتسجيل الدخول بالفعل!"
        alertEl.style.background = "#d1fad1";
        alertEl.style.display = "block";
        setTimeout(() => {
            window.location.href = "/";
        }, 5000);

        return;
    }

    else {

        loginbox.style.display = "block";
        loggedIn_bt.addEventListener("click", async () => {
            let loginURL = window.location.href;
            let loginFetch = await fetch(loginURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginusername.value,
                    password: loginpassword.value
                }),
            });
            let response = await loginFetch?.json();

            if (response?.logged_in) {
                window.location.href = "/";
            }
            else if (response?.locked) {

                alertEl.innerText = response?.massage;
                alertEl.style.display = "block";
                loginusername_massage.style.display = "block";
            }
            else {
                alertEl.innerText = "بيانات الدخول غير صحيحة يرجى التأكد من البيانات وإعادة المحاولة"
                alertEl.style.display = "block";
                loginusername_massage.style.display = "block";
            }
        });
    }
});