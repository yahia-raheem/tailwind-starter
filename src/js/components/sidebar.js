let isOpen = false;
const sideBar = document.getElementById("mySidenav");
document.addEventListener("DOMContentLoaded", () => {
  const togglebtn = document.querySelector(".navbar-toggler");
  const closebtn = document.querySelector(".closebtn");
  const sidemenuItems = document.querySelectorAll(".mobile-menu .menu-item");

  sidemenuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item.classList.contains("menu-item-has-children")) {
        const submenu = item.querySelector(".sub-menu");
        const itemsNum = item.querySelectorAll(".menu-item").length;
        if (submenu.classList.contains("opened")) {
          item.classList.remove('child-menu-opened');
          submenu.classList.remove("opened");
          submenu.style.maxHeight = 0;
        } else {
          item.classList.add('child-menu-opened');
          submenu.classList.add("opened");
          submenu.style.maxHeight = `${itemsNum * 64}px`;
        }
      }
    });
  });

  togglebtn.addEventListener("click", () => {
    openNav();
    document.addEventListener("click", outsideClickListener);
    setTimeout(() => {
      isOpen = true;
    }, 1000);
  });
  closebtn.addEventListener("click", () => {
    closeNav();
  });
});

const openNav = () => {
  sideBar.style.width = "100vw";
};

const closeNav = () => {
  sideBar.style.width = "0";
  isOpen = false;
  removeClickListener();
};
const outsideClickListener = (event) => {
  if (!sideBar.contains(event.target) && isOpen) {
    closeNav();
  }
};

const removeClickListener = () => {
  document.removeEventListener("click", outsideClickListener);
};
