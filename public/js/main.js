document.addEventListener("DOMContentLoaded", async function () {
    const options = window.options;
    const header_menu_left = document.getElementById("header_menu_left");
    const header_menu_left_isLoggedIn = document.getElementById("header_menu_left_isLoggedIn");
    const menu_logged = document.getElementById("menu_logged");
    let isMenu = false;
    let isSideMenu = false;

    const menuButton = document.getElementById('button_menu_header');
    const sideMenuBox = document.getElementById('SideMenuBox');
    const sideMenu = document.getElementById('SideMenu');

    menuButton.addEventListener('click', toggleSideMenu);

    document.addEventListener('click', closeSideMenu);

    if (options?.session?.isLoggedIn) {
        header_menu_left.style.display = "none";
        header_menu_left_isLoggedIn.style.display = "block";
        header_menu_left_isLoggedIn.addEventListener("click", toggleMenu);
    }

    async function toggleSideMenu(event) {
        sideMenuBox.classList.toggle('active');
        sideMenu.classList.toggle('active');
        if (isSideMenu) {
            sideMenuBox.style.display = "none";
            isSideMenu = false;
        } else {
            sideMenuBox.style.display = "block";
            isSideMenu = true;
        }
    }

    async function closeSideMenu(event) {
        const targetElement = event.target;
        if (!targetElement.closest('#SideMenu') && !targetElement.closest('#button_menu_header') && isSideMenu) {
            sideMenuBox.classList.toggle('active');
            sideMenu.classList.toggle('active');
            sideMenuBox.style.display = "none";
            isSideMenu = false;
        } else if (!targetElement.closest('#header_menu_left_isLoggedIn') && !targetElement.closest('#menu_logged') && isMenu) {
            menu_logged.style.display = "none";
            isMenu = false;
        }
    }

    async function toggleMenu() {
        const logoutButton = document.getElementById("logoutButton");
        if (!isMenu) {
            logoutButton.addEventListener("click", logout);
            menu_logged.style.display = "block";
            isMenu = true;
        } else {
            menu_logged.style.display = "none";
            isMenu = false;
        }
    }

    async function logout() {
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
    }
});  