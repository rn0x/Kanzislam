document.addEventListener("DOMContentLoaded", function () {
    const options = window.options;
    const header_menu_left = document.getElementById("header_menu_left");
    const header_menu_left_isLoggedIn = document.getElementById("header_menu_left_isLoggedIn");
    const menu_logged = document.getElementById("menu_logged");
    let isMenu = false;
    let isSideMenu = false;

    const menuButton = document.getElementById('button_menu_header');
    const sideMenuBox = document.getElementById('SideMenuBox');
    const sideMenu = document.getElementById('SideMenu');
    const SideMenuLogin = document.getElementById('SideMenuLogin');
    const SideMenuRegister = document.getElementById('SideMenuRegister');
    const SideMenuProfile = document.getElementById('SideMenuProfile');
    const SideMenuSettings = document.getElementById('SideMenuSettings');
    const SideMenuLogout = document.getElementById('SideMenuLogout');
    const toggleMenuProfile = document.getElementById('toggleMenuProfile');
    const buttonTheme = document.getElementById('buttonTheme');
    const storage = window.localStorage;
    const getTheme = storage.getItem("theme");

    if (getTheme === "dark") {
        document.querySelector("html").setAttribute("data-theme", "dark");
        buttonTheme.src = "/icon/light.svg";
    }
    if (getTheme === "light") {
        document.querySelector("html").setAttribute("data-theme", "light");
        buttonTheme.src = "/icon/dark.svg";
    }

    // تبديل حالة القائمة الجانبية عند النقر على زر القائمة
    menuButton.addEventListener('click', toggleSideMenu);
    // إغلاق القائمة الجانبية عند النقر خارجها
    document.addEventListener('click', closeSideMenu);

    // تغيير بين الوضع الليلي والنهاري
    buttonTheme.addEventListener('click', ThemeHandler);


    if (options?.session?.isLoggedIn) {
        header_menu_left.style.display = "none";
        header_menu_left_isLoggedIn.style.display = "block";
        SideMenuLogout.style.display = "block";
        SideMenuLogin.style.display = "none";
        SideMenuRegister.style.display = "none";
        SideMenuProfile.href = `${window.location.origin}/username/${options?.session?.username}`;
        toggleMenuProfile.href = `${window.location.origin}/username/${options?.session?.username}`;

        // تبديل حالة القائمة المنسدلة عند النقر على القائمة المستخدم المسجل الدخول
        header_menu_left_isLoggedIn.addEventListener("click", toggleMenu);

        // زر تسجيل الخروج في القائة الجانبية
        SideMenuLogout.addEventListener("click", logout);
    }

    else {
        SideMenuProfile.style.display = "none";
        SideMenuSettings.style.display = "none";
    }

    // تبديل حالة القائمة الجانبية
    function toggleSideMenu(event) {
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

    // إغلاق القائمة الجانبية
    function closeSideMenu(event) {
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

    // تبديل حالة القائمة المنسدلة
    function toggleMenu() {
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

    // تسجيل الخروج
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

    // نوع الثيم
    function ThemeHandler() {
        const getTheme = storage.getItem("theme");
        if (getTheme === "dark") {
            storage.setItem("theme", "light");
            buttonTheme.src = "/icon/dark.svg";
        }

        else {
            storage.setItem("theme", "dark");
            buttonTheme.src = "/icon/light.svg";
        }

        window.location.href = window.location.href
    }

});