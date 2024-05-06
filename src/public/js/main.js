document.addEventListener("DOMContentLoaded", function () {

  const menuButton = document.getElementById("button_menu_header");
  const sideMenuBox = document.getElementById("SideMenuBox");
  const sideMenu = document.getElementById("SideMenu");
  const buttonTheme = document.getElementById("buttonTheme");

  if (localStorage.getItem("theme") == "dark") {
    document.getElementById("iconLogo").src = "/icon/logo-dark.svg";
    buttonTheme.className = "fa-solid fa-lightbulb";
    document.getElementById("logo_footer").src = "/icon/logoFooterDark.svg";
  }

  // احصل على جميع عناصر img
  const images = document.querySelectorAll("img");

  // تعيين خاصية loading="lazy" لكل عنصر img
  images.forEach((img) => {
    img.setAttribute("loading", "lazy");
  });

  // تبديل حالة القائمة الجانبية عند النقر على زر القائمة
  menuButton.addEventListener("click", toggleSideMenu);
  // إغلاق القائمة الجانبية عند النقر خارجها
  document.addEventListener("click", closeSideMenu);

  // تغيير بين الوضع الليلي والنهاري
  buttonTheme.addEventListener("click", ThemeHandler);

  // تبديل حالة القائمة الجانبية
  let isSideMenu = false;
  function toggleSideMenu(event) {
    sideMenuBox.classList.toggle("active");
    sideMenu.classList.toggle("active");
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
    if (
      !targetElement.closest("#SideMenu") &&
      !targetElement.closest("#button_menu_header") &&
      isSideMenu
    ) {
      sideMenuBox.classList.toggle("active");
      sideMenu.classList.toggle("active");
      sideMenuBox.style.display = "none";
      isSideMenu = false;
    }
  }

  // نوع الثيم
  function ThemeHandler() {
    if (localStorage.getItem("theme") == "dark") {
      localStorage.setItem("theme", "light");
      buttonTheme.className = "fa-solid fa-moon";
    } else {
      localStorage.setItem("theme", "dark");
      buttonTheme.className = "fa-solid fa-lightbulb";
    }

    location.reload(true);
  }
});
