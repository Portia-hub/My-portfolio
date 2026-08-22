const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

const animatedItems = document.querySelectorAll('[data-animate]');

const revealOnScroll = () => {
  animatedItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 90) {
      item.classList.add('visible');
    }
  });
};

window.addEventListener('DOMContentLoaded', revealOnScroll);
window.addEventListener('scroll', revealOnScroll);

const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');

    if (mainNav) {
      mainNav.classList.remove('open');
    }
  });
});
