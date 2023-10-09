document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    let header_menu_left = document.getElementById("header_menu_left");
    let header_menu_left_isLoggedIn = document.getElementById("header_menu_left_isLoggedIn");
    let menu_logged = document.getElementById("menu_logged");
    let isMenu = false

    // احصل على زر القائمة
    const menuButton = document.getElementById('icon_menu');
    // احصل على القائمة الجانبية
    const sideMenuBox = document.getElementById('SideMenuBox');
    const sideMenu = document.getElementById('SideMenu');

    // أضف استماع للنقر على زر القائمة
    menuButton.addEventListener('click', function () {
        sideMenuBox.style.display = "block";
        sideMenuBox.classList.toggle('active');
        sideMenu.classList.toggle('active');
    });


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