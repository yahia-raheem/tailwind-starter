document.addEventListener("DOMContentLoaded", () => {
  const navBar = document.querySelector(".nav-container");
  navDesktop();
  document.addEventListener("scroll", function () {
    navDesktop();
  });

  function navDesktop() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
      navBar.classList.add("fixed", "shadow");
    } else {
      navBar.classList.remove("fixed", "shadow");
    }
  }
});
