document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;

    if (options?.isUpdatePassword) {

        const password = document.getElementById("password");
        const password_confirmation = document.getElementById("password_confirmation");
        const upPassButton = document.getElementById("upPassButton");
        const alertUpPass = document.getElementById("alertUpPass");
        const password_message = document.getElementById("password_message");
        const password_confirmation_message = document.getElementById("password_confirmation_message");

        upPassButton.addEventListener("click", async () => {

            if (password.value && password_confirmation.value && options?.email) {

                if (password.value === password_confirmation.value) {

                    let upPassURL = `${window.location.origin}/update-password`;
                    let upPassFetch = await fetch(upPassURL, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            password: password.value,
                            password_confirmation: password_confirmation.value,
                            email: options?.email
                        }),
                    });
                    let response = await upPassFetch?.json();

                    if (response?.isUpdatePass) {
                        alertUpPass.innerText = response?.message;
                        alertUpPass.style.display = "block";
                        alertUpPass.style.backgroundColor = "#d2fad1";
                        alertUpPass.style.borderColor = "#96e296";
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 7000);
                    }

                    else {
                        alertUpPass.innerText = response?.message;
                        alertUpPass.style.display = "block";
                        setTimeout(() => {
                            alertUpPass.style.display = "none";
                        }, 7000);
                    }
                }

                else {

                    password_confirmation_message.innerText = "كلمة المرور غير متطابقة";
                    password_confirmation_message.style.display = "block";
                    password_confirmation.style.borderColor = "#ff4646";
                    alertUpPass.style.display = "block";
                    setTimeout(() => {
                        password_confirmation_message.style.display = "none";
                        password_confirmation.style.borderColor = "";
                        alertUpPass.style.display = "none";
                    }, 10000);
                }

            }

            else {

                if (!password || password.value.length < 8) {
                    password_message.innerText = "يجب أن يكون طول كلمة المرور 8 أحرف أو أكثر";
                    password_message.style.display = "block";
                    password.style.borderColor = "#ff4646";
                    setTimeout(() => {
                        password_message.style.display = "none";
                        password.style.borderColor = "";
                    }, 7000);
                }

                if (!password_confirmation || password_confirmation.value.length < 8) {
                    password_confirmation_message.innerText = "يجب أن يكون طول تأكيد كلمة المرور 8 أحرف أو أكثر";
                    password_confirmation_message.style.display = "block";
                    password_confirmation.style.borderColor = "#ff4646";
                    setTimeout(() => {
                        password_confirmation_message.style.display = "none";
                        password_confirmation.style.borderColor = "";
                    }, 7000);
                }

                alertUpPass.style.display = "block";
                setTimeout(() => {
                    alertUpPass.style.display = "none";
                }, 10000);
            }
        });

    }

    else {
        setTimeout(() => {
            window.location.href = "/";
        }, 7000);
    }
});