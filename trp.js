// MOBILE MENU
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});


// SCROLL REVEAL ANIMATION SYSTEM

const scrollElements = document.querySelectorAll(".animate-on-scroll");

// function to check if element is in view
const elementInView = (el, offset = 100) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
};

// add show class
const displayScrollElement = (element) => {
  element.classList.add("show");
};

// hide (optional for reset behavior)
const hideScrollElement = (element) => {
  element.classList.remove("show");
};

// loop scroll elements
const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 120)) {
      displayScrollElement(el);
    }
  });
};

// run on scroll
window.addEventListener("scroll", () => {
  handleScrollAnimation();
});

// run once on load (important)
handleScrollAnimation();

