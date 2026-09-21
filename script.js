
document.addEventListener("DOMContentLoaded", () => {

  const cursor = document.querySelector(".cursor");
  const cursorOutline = document.querySelector(".cursor-outline");
  const magneticElements = document.querySelectorAll(".magnetic");
  const revealElements = document.querySelectorAll(".reveal");

  const isTouch =
    window.matchMedia("(hover: none)").matches;

  /* CURSOR */

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  if (!isTouch) {

    window.addEventListener("mousemove", event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      outlineX += (mouseX - outlineX) * .12;
      outlineY += (mouseY - outlineY) * .12;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll("a, span, .skill-cloud span").forEach(element => {

      element.addEventListener("mouseenter", () => {
        cursorOutline.classList.add("large");
      });

      element.addEventListener("mouseleave", () => {
        cursorOutline.classList.remove("large");
      });

    });
  }

  /* MAGNETIC ELEMENTS */

  if (!isTouch) {

    magneticElements.forEach(element => {

      element.addEventListener("mousemove", event => {

        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        element.style.transform =
          `translate(${x * .12}px, ${y * .12}px)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });

    });

  }

  /* REVEAL ON SCROLL */

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }

    });

  }, {
    threshold: .15
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });

  /* SMOOTH NAVIGATION */

  document.querySelectorAll("a[href^='#']").forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

  /* PARALLAX TYPOGRAPHY */

  const heroTitle = document.querySelector(".hero-title");

  window.addEventListener("scroll", () => {

    if (!heroTitle) return;

    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight * 1.2) {
      heroTitle.style.transform =
        `translateY(${scrollY * .12}px)`;
    }

  }, {
    passive: true
  });

});
