
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  
  if (loader) {
    window.addEventListener("load", () => {
      loader.classList.add("done");
    });
  }

  window.addEventListener("beforeunload", (e) => {
    if (loader) {
      loader.classList.remove("done");
      loader.classList.add("pending");
    }
  });

  
});

