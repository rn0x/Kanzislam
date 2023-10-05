document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    let header_menu_left = document.getElementById("header_menu_left");
    let header_menu_left_isLoggedIn = document.getElementById("header_menu_left_isLoggedIn");
    let menu_logged = document.getElementById("menu_logged");
    let isMenu = false

    if (options?.session?.isLoggedIn) {

        header_menu_left.style.display = "none";
        header_menu_left_isLoggedIn.style.display = "block";

        header_menu_left_isLoggedIn.addEventListener("click", async () => {

            let logoutButton = document.getElementById("logoutButton");

            if (isMenu === false) {
                menu_logged.style.display = "block";
                isMenu = true;

                logoutButton.addEventListener("click", async () => {

                    let logoutURL = `${window.location.origin}/logout`;
                    let logoutFetch = await fetch(logoutURL, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    let response = await logoutFetch?.json();

                    if (response?.logout) {
                        window.location.href = "/";
                    }
                });
            }

            else {
                menu_logged.style.display = "none";
                isMenu = false
            }
        });
    }


});