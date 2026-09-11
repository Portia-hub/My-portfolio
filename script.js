// Mobile nav toggle — the only interactive behavior this site needs.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const rail = document.getElementById("rail");
  if (!toggle || !rail) return;

  toggle.addEventListener("click", () => {
    const isOpen = rail.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Close" : "Menu";
  });

  // Close the mobile menu after choosing a link, so navigation feels responsive.
  rail.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (rail.classList.contains("open")) {
        rail.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  });
});
