const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const slideshows = [...document.querySelectorAll("[data-slideshow]")];
const contactForm = document.querySelector("[data-contact-form]");

document.body.classList.add("is-ready");

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

slideshows.forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll("[data-slide]")];
  const prev = slideshow.querySelector(".hero-nav-prev, .testimonial-nav-prev");
  const next = slideshow.querySelector(".hero-nav-next, .testimonial-nav-next");
  const slideFrame = slideshow.querySelector(".testimonial-slides");
  const intervalMs = Number(slideshow.dataset.interval) || 7000;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (!slides.length) return;
  if (activeIndex < 0) activeIndex = 0;

  const syncHeight = () => {
    if (!slideFrame) return;
    slideFrame.style.height = `${slides[activeIndex].offsetHeight}px`;
  };

  const showSlide = (index) => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add("is-active");
    syncHeight();
  };

  prev?.addEventListener("click", () => showSlide(activeIndex - 1));
  next?.addEventListener("click", () => showSlide(activeIndex + 1));
  window.addEventListener("resize", syncHeight);
  syncHeight();

  if (slides.length > 1) {
    setInterval(() => {
      showSlide(activeIndex + 1);
    }, intervalMs);
  }
});

const revealGroups = [
  { selector: ".section-heading", direction: "up" },
  { selector: ".services-grid .card", direction: "up", stagger: 90 },
  { selector: ".about-feature-media", direction: "left" },
  { selector: ".about-feature-copy", direction: "right", delay: 120 },
  { selector: ".communication-panel", direction: "up" },
  { selector: ".podcast-media-image-shell", direction: "left" },
  { selector: ".podcast-media-video-shell", direction: "right", delay: 120 },
  { selector: ".partner-grid .partner-card", direction: "up", stagger: 100 },
  { selector: ".testimonial-slider", direction: "up" },
  { selector: "#packages .service-list", direction: "left" },
  { selector: ".pricing-grid .price-card", direction: "up", stagger: 100 },
  { selector: ".contact-form-card", direction: "left" },
  { selector: ".contact-info-card", direction: "right", delay: 140 }
];

const revealElements = revealGroups.flatMap(({ selector, direction, stagger = 0, delay = 0 }) =>
  [...document.querySelectorAll(selector)].map((element, index) => {
    element.dataset.reveal = direction;
    element.style.setProperty("--reveal-delay", `${delay + index * stagger}ms`);
    return element;
  })
);

if (revealElements.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealed = new WeakSet();
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        entry.target.classList.add("is-visible");
        revealed.add(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (contactForm) {
  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');
  const phoneInput = contactForm.querySelector('input[name="phone"]');
  const messageInput = contactForm.querySelector('textarea[name="message"]');
  const honeypot = contactForm.querySelector('input[name="company_site"]');
  const humanCheck = contactForm.querySelector('input[name="human_check"]');
  const errorMessage = contactForm.querySelector(".contact-antibot-error");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm.addEventListener("submit", (event) => {
    const nameValue = nameInput ? nameInput.value.trim() : "";
    const emailValue = emailInput ? emailInput.value.trim() : "";
    const phoneValue = phoneInput ? phoneInput.value.trim() : "";
    const messageValue = messageInput ? messageInput.value.trim() : "";
    const botTriggered = honeypot && honeypot.value.trim() !== "";
    const humanAnswer = humanCheck ? humanCheck.value.trim() : "";
    const mathIsValid = humanAnswer === "5";
    const phoneDigits = phoneValue.replace(/\D/g, "");

    const showError = (message, field) => {
      event.preventDefault();

      if (errorMessage) {
        errorMessage.hidden = false;
        errorMessage.textContent = message;
      }

      field?.focus();
    };

    if (nameValue.length < 2) {
      showError("Please enter your full name.", nameInput);
      return;
    }

    if (!emailPattern.test(emailValue)) {
      showError("Please enter a valid email address.", emailInput);
      return;
    }

    if (phoneDigits.length < 10) {
      showError("Please enter a valid phone number with at least 10 digits.", phoneInput);
      return;
    }

    if (messageValue.length < 10) {
      showError("Please provide a little more information in your message.", messageInput);
      return;
    }

    if (botTriggered || !mathIsValid) {
      showError("Please complete the anti-bot check before sending.", humanCheck);
      return;
    }

    if (errorMessage) {
      errorMessage.hidden = true;
      errorMessage.textContent = "";
    }
  });
}
