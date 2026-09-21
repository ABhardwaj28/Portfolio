
// =========================================
// APOORVA BHARDWAJ — INTERACTIVE PORTFOLIO
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  const orb = document.querySelector(".orb");
  const orbContainer = document.querySelector("#orb-container");

  const magneticElements = document.querySelectorAll(".magnetic");
  const tiltCards = document.querySelectorAll(".project-tilt");
  const revealElements = document.querySelectorAll(".reveal");


  // =========================================
  // 1. CUSTOM CURSOR
  // =========================================

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let followerX = mouseX;
  let followerY = mouseY;

  const isTouchDevice =
    window.matchMedia("(hover: none)").matches;

  if (!isTouchDevice && cursor && follower) {

    document.addEventListener("mousemove", (event) => {

      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

    });

    function animateFollower() {

      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);

    }

    animateFollower();

  }


  // =========================================
  // 2. MAGNETIC ELEMENTS
  // =========================================

  magneticElements.forEach((element) => {

    element.addEventListener("mousemove", (event) => {

      if (isTouchDevice) return;

      const rect = element.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      const strength = 0.25;

      element.style.transform =
        `translate(${x * strength}px, ${y * strength}px)`;

      if (follower) {
        follower.classList.add("hovering");
      }

    });

    element.addEventListener("mouseleave", () => {

      element.style.transform = "";

      if (follower) {
        follower.classList.remove("hovering");
      }

    });

  });


  // =========================================
  // 3. MOUSE-CONTROLLED 3D ORB
  // =========================================

  if (orb && orbContainer) {

    orbContainer.addEventListener("mousemove", (event) => {

      if (isTouchDevice) return;

      const rect = orbContainer.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = -y * 30;
      const rotateY = x * 30;

      orb.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    });

    orbContainer.addEventListener("mouseleave", () => {

      orb.style.transform = "";

    });

  }


  // =========================================
  // 4. 3D PROJECT CARD TILT
  // =========================================

  tiltCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

      if (isTouchDevice) return;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform =
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";

    });

  });


  // =========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // =========================================

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("active");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => {

    observer.observe(element);

  });


  // =========================================
  // 6. SCROLL PARALLAX
  // =========================================

  const heroVisual = document.querySelector(".hero-visual");
  const heroGlow = document.querySelector(".hero-background-glow");

  let ticking = false;

  function updateParallax() {

    const scrollY = window.scrollY;

    if (heroVisual) {

      heroVisual.style.transform =
        `translateY(${scrollY * 0.12}px)`;

    }

    if (heroGlow) {

      heroGlow.style.transform =
        `translateY(${scrollY * 0.18}px)`;

    }

    ticking = false;

  }

  window.addEventListener("scroll", () => {

    if (!ticking) {

      window.requestAnimationFrame(updateParallax);

      ticking = true;

    }

  }, { passive: true });


  // =========================================
  // 7. MOBILE MENU
  // =========================================

  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {

    menuButton.addEventListener("click", () => {

      const isOpen = navLinks.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });

    navLinks.querySelectorAll("a").forEach((link) => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  // =========================================
  // 8. ACTIVE NAVIGATION
  // =========================================

  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(".nav-links a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          navigationLinks.forEach((link) => {

            link.classList.remove("active");

            if (
              link.getAttribute("href") ===
              `#${entry.target.id}`
            ) {

              link.classList.add("active");

            }

          });

        }

      });

    },
    {
      threshold: 0.45
    }
  );

  sections.forEach((section) => {

    sectionObserver.observe(section);

  });


  // =========================================
  // 9. KEYBOARD ACCESSIBILITY
  // =========================================

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      navLinks?.classList.remove("open");

      menuButton?.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

});


  // =========================================
  // 10. CINEMATIC FLIGHT SECTION TRANSITIONS
  // =========================================

  const flightSections = document.querySelectorAll(
    "main section"
  );

  let flightTicking = false;

  function updateFlightMotion() {

    const viewportCenter = window.innerHeight / 2;

    flightSections.forEach((section, index) => {

      const rect = section.getBoundingClientRect();

      const sectionCenter = rect.top + rect.height / 2;

      const distanceFromCenter =
        (sectionCenter - viewportCenter) /
        window.innerHeight;

      // Alternate banking directions
      const direction = index % 2 === 0 ? -1 : 1;

      // Limit rotation to avoid excessive movement
      const rotation =
        Math.max(-8, Math.min(8,
          distanceFromCenter * 10 * direction
        ));

      // Depth illusion
      const depth =
        Math.max(-80, Math.min(80,
          distanceFromCenter * 70
        ));

      // Horizontal banking movement
      const horizontal =
        Math.max(-35, Math.min(35,
          distanceFromCenter * 35 * direction
        ));

      // Slight scale adjustment
      const scale =
        1 - Math.min(0.035, Math.abs(distanceFromCenter) * 0.025);

      // Fade distant sections slightly
      const opacity =
        Math.max(0.72, 1 - Math.abs(distanceFromCenter) * 0.22);

      section.style.transform = `
        translate3d(${horizontal}px, 0, ${-Math.abs(depth)}px)
        rotateY(${rotation}deg)
        scale(${scale})
      `;

      section.style.opacity = opacity;

    });

    flightTicking = false;

  }

  function requestFlightMotion() {

    if (!flightTicking) {

      window.requestAnimationFrame(updateFlightMotion);

      flightTicking = true;

    }

  }

  window.addEventListener(
    "scroll",
    requestFlightMotion,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestFlightMotion
  );

  // Initial animation state
  requestFlightMotion();
