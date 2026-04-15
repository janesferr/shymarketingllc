const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const slideshow = document.querySelector("[data-slideshow]");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (slideshow) {
  const slides = [...slideshow.querySelectorAll("[data-slide]")];
  const prev = slideshow.querySelector(".hero-nav-prev");
  const next = slideshow.querySelector(".hero-nav-next");
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeIndex < 0) activeIndex = 0;

  const showSlide = (index) => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add("is-active");
  };

  prev?.addEventListener("click", () => showSlide(activeIndex - 1));
  next?.addEventListener("click", () => showSlide(activeIndex + 1));

  setInterval(() => {
    showSlide(activeIndex + 1);
  }, 7000);
}
