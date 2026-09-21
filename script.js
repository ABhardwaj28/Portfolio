
"use strict";

/* --------------------------------
   LOADER
-------------------------------- */

window.addEventListener("load", () => {
  const loader = document.querySelector("#loader");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 1600);
});


/* --------------------------------
   CUSTOM CURSOR
-------------------------------- */

const cursor = document.querySelector(".cursor");
const cursorOutline = document.querySelector(".cursor-outline");

const hasPointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

if (hasPointer && cursor && cursorOutline) {

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener("pointermove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.transform =
      `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

  }, { passive: true });

  function animateCursor() {

    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.transform =
      `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.querySelectorAll("a, .magnetic").forEach((element) => {

    element.addEventListener("pointerenter", () => {
      cursorOutline.classList.add("large");
    });

    element.addEventListener("pointerleave", () => {
      cursorOutline.classList.remove("large");
    });

  });

}


/* --------------------------------
   MAGNETIC ELEMENTS
-------------------------------- */

if (hasPointer) {

  document.querySelectorAll(".magnetic").forEach((element) => {

    element.addEventListener("pointermove", (event) => {

      const rect = element.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      element.style.transform =
        `translate(${x * 0.15}px, ${y * 0.15}px)`;

    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "translate(0, 0)";
    });

  });

}


/* --------------------------------
   VIRTUAL FLIGHT ENGINE
-------------------------------- */

const panels = [
  ...document.querySelectorAll(".scene-panel")
];

const anchors = [
  ...document.querySelectorAll(".scroll-anchor")
];

const stage = document.querySelector("#stage");
const overlay = document.querySelector(".flight-overlay");

let currentPosition = 0;
let targetPosition = 0;
let previousScroll = window.scrollY;
let scrollVelocity = 0;

const totalPanels = panels.length;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getScrollPosition() {

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) return 0;

  return clamp(
    window.scrollY / maxScroll * (totalPanels - 1),
    0,
    totalPanels - 1
  );

}

function updateTargetPosition() {
  targetPosition = getScrollPosition();
}

function renderFlight() {

  currentPosition +=
    (targetPosition - currentPosition) * 0.075;

  const movement =
    Math.abs(targetPosition - currentPosition);

  panels.forEach((panel, index) => {

    const distance = index - currentPosition;
    const absoluteDistance = Math.abs(distance);

    const isActive = absoluteDistance < 0.48;

    const direction = distance >= 0 ? 1 : -1;

    /*
      Panels move sideways while rotating.
      This creates the sensation of flying through
      a sequence of virtual rooms.
    */

    const translateX = distance * 115;
    const translateY = distance * distance * 8;

    const translateZ =
      -absoluteDistance * 900;

    const rotateY =
      clamp(distance * -35, -65, 65);

    const rotateX =
      clamp(distance * distance * direction * 7, -14, 14);

    const rotateZ =
      clamp(distance * -8, -16, 16);

    const scale =
      clamp(1 - absoluteDistance * 0.16, 0.72, 1);

    const opacity =
      clamp(1 - absoluteDistance * 0.9, 0, 1);

    panel.style.transform = `
      translate3d(
        ${translateX}px,
        ${translateY}px,
        ${translateZ}px
      )
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotateZ(${rotateZ}deg)
      scale(${scale})
    `;

    panel.style.opacity = opacity;

    panel.style.visibility =
      absoluteDistance < 1.8 ? "visible" : "hidden";

    panel.classList.toggle("active", isActive);

  });

  /*
    Overlay becomes stronger while moving quickly.
  */

  const overlayStrength = clamp(movement * 4, 0, 0.75);

  overlay.style.opacity = overlayStrength;

  if (overlayStrength > 0.08) {
    overlay.style.transform =
      `scale(${1 + overlayStrength * 0.08})`;
  } else {
    overlay.style.transform = "scale(1)";
  }

  requestAnimationFrame(renderFlight);

}

window.addEventListener(
  "scroll",
  updateTargetPosition,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateTargetPosition
);

updateTargetPosition();
renderFlight();


/* --------------------------------
   SCROLL VELOCITY
-------------------------------- */

function updateScrollVelocity() {

  const currentScroll = window.scrollY;

  scrollVelocity =
    Math.abs(currentScroll - previousScroll);

  previousScroll = currentScroll;

  const intensity =
    clamp(scrollVelocity / 40, 0, 1);

  document.documentElement.style.setProperty(
    "--flight-intensity",
    intensity
  );

}

window.addEventListener(
  "scroll",
  updateScrollVelocity,
  { passive: true }
);


/* --------------------------------
   NAVIGATION
-------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", (event) => {

    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    const panelIndex =
      Number(target.dataset.index);

    if (!Number.isNaN(panelIndex)) {

      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const destination =
        maxScroll * (panelIndex / (totalPanels - 1));

      window.scrollTo({
        top: destination,
        behavior: "smooth"
      });

    } else {

      const anchorId =
        targetId.replace("#", "") + "-anchor";

      const anchor =
        document.querySelector(`#${anchorId}`);

      if (anchor) {
        anchor.scrollIntoView({
          behavior: "smooth"
        });
      }

    }

  });

});


/* --------------------------------
   KEYBOARD NAVIGATION
-------------------------------- */

window.addEventListener("keydown", (event) => {

  if (event.key === "ArrowDown" || event.key === "PageDown") {

    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth"
    });

  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {

    window.scrollBy({
      top: -window.innerHeight,
      behavior: "smooth"
    });

  }

});


/* --------------------------------
   STARFIELD / WARP BACKGROUND
-------------------------------- */

const canvas = document.querySelector("#space");
const context = canvas.getContext("2d");

let width;
let height;

const stars = [];
const starCount = 260;

function resizeCanvas() {

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

}

function createStar() {

  return {
    x: (Math.random() - 0.5) * width,
    y: (Math.random() - 0.5) * height,
    z: Math.random() * width,
    previousZ: 0
  };

}

for (let i = 0; i < starCount; i++) {
  stars.push(createStar());
}

function drawStars() {

  context.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  const speed =
    2 + Math.min(scrollVelocity * 0.5, 35);

  for (const star of stars) {

    star.previousZ = star.z;
    star.z -= speed;

    if (star.z <= 1) {
      Object.assign(star, createStar());
      star.z = width;
      star.previousZ = star.z;
    }

    const scale = width / star.z;

    const x = star.x * scale + centerX;
    const y = star.y * scale + centerY;

    const previousScale =
      width / star.previousZ;

    const previousX =
      star.x * previousScale + centerX;

    const previousY =
      star.y * previousScale + centerY;

    const size =
      Math.max(0.4, (1 - star.z / width) * 2.5);

    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(x, y);

    context.lineWidth = size;
    context.strokeStyle =
      `rgba(200,255,61,${1 - star.z / width})`;

    context.stroke();

  }

  requestAnimationFrame(drawStars);

}

resizeCanvas();
drawStars();

window.addEventListener("resize", resizeCanvas);


/* --------------------------------
   REDUCE MOTION SUPPORT
-------------------------------- */

if (window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches) {

  document.documentElement.style.scrollBehavior = "auto";

  panels.forEach((panel) => {
    panel.style.transition = "none";
  });

}
