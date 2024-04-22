document.addEventListener("DOMContentLoaded", async function () {
    let isMenu = false;
    let isSideMenu = false;

    const menuButton = document.getElementById('button_menu_header');
    const sideMenuBox = document.getElementById('SideMenuBox');
    const sideMenu = document.getElementById('SideMenu');
    const SideMenuSettings = document.getElementById('SideMenuSettings');
    const buttonTheme = document.getElementById('buttonTheme');
    const storage = window.localStorage;
    const getTheme = storage.getItem("theme");

    if (getTheme === "dark") {
        document.querySelector("html").setAttribute("data-theme", "dark");
        buttonTheme.src = "/static/icon/light.svg";
    }
    if (getTheme === "light") {
        document.querySelector("html").setAttribute("data-theme", "light");
        buttonTheme.src = "/static/icon/dark.svg";
    }

    // احصل على جميع عناصر img
    const images = document.querySelectorAll('img');

    // تعيين خاصية loading="lazy" لكل عنصر img
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    // تبديل حالة القائمة الجانبية عند النقر على زر القائمة
    menuButton.addEventListener('click', toggleSideMenu);
    // إغلاق القائمة الجانبية عند النقر خارجها
    document.addEventListener('click', closeSideMenu);

    // تغيير بين الوضع الليلي والنهاري
    buttonTheme.addEventListener('click', ThemeHandler);

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
        }
    }

    // نوع الثيم
    function ThemeHandler() {
        const getTheme = storage.getItem("theme");
        if (getTheme === "dark") {
            storage.setItem("theme", "light");
            buttonTheme.src = "/static/icon/dark.svg";
        }

        else {
            storage.setItem("theme", "dark");
            buttonTheme.src = "/static/icon/light.svg";
        }

        window.location.href = window.location.href
    }
});