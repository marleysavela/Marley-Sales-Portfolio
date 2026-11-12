
/*
  LAB 10.6 — PORTFOLIO INTERACTIVITY
  Marley Savela

  Custom JavaScript:
  - Dark/light mode with saved preferences
  - Interactive project filtering
  - Reading progress bar
  - Back-to-top button

  Third-party library:
  - ScrollReveal animations
*/

document.addEventListener("DOMContentLoaded", () => {

  // 1. DARK / LIGHT MODE
  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("#theme-icon");
  const themeLabel = document.querySelector("#theme-label");

  const systemDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  function getSavedTheme() {
    try {
      return localStorage.getItem("marley-theme");
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("marley-theme", theme);
    } catch {
      // Theme switching still works without storage.
    }
  }

  function applyTheme(theme) {
    const dark = theme === "dark";

    document.documentElement.setAttribute(
      "data-theme", theme
    );

    themeIcon.textContent = dark ? "☀" : "☾";
    themeLabel.textContent = dark ? "Light mode" : "Dark mode";

    themeButton.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeButton.setAttribute("aria-pressed", String(dark));
  }

  const savedTheme = getSavedTheme();

  applyTheme(
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : systemDark.matches ? "dark" : "light"
  );

  themeButton.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme");

    const next = current === "dark" ? "light" : "dark";

    applyTheme(next);
    saveTheme(next);
  });


  // 2. SCROLLREVEAL ANIMATIONS
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduceMotion && typeof ScrollReveal !== "undefined") {
    const reveal = ScrollReveal({
      distance: "22px",
      duration: 750,
      easing: "ease-out",
      opacity: 0,
      reset: false,
      mobile: true
    });

    reveal.reveal(".eyebrow, .section-label", {
      origin: "bottom",
      interval: 100
    });

    reveal.reveal("h1, section h2", {
      origin: "bottom",
      delay: 80
    });

    reveal.reveal("#about figure", {
      origin: "right",
      distance: "30px"
    });
  }


  // 3. INTERACTIVE PROJECT FILTERS
  const filterButtons = document.querySelectorAll(".filter-btn");

  const projectCards = document.querySelectorAll(
    "#projects article[data-category]"
  );

  const filterStatus = document.querySelector("#filter-status");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach((card) => {
        const match =
          category === "all" ||
          card.dataset.category === category;

        card.hidden = !match;

        if (match) visibleCount++;
      });

      filterStatus.textContent =
        `${visibleCount} projects displayed.`;
    });
  });


  // 4. SCROLL PROGRESS BAR
  const progressBar = document.querySelector("#scroll-progress");
  const backToTop = document.querySelector("#back-to-top");

  let scrollScheduled = false;

  function updateScrollFeatures() {
    const scrollY = window.scrollY;

    const scrollableHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress = scrollableHeight > 0
      ? Math.min(100, scrollY / scrollableHeight * 100)
      : 0;

    progressBar.style.width = `${progress}%`;

    backToTop.hidden = scrollY < 450;
    scrollScheduled = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateScrollFeatures);
    }
  }, { passive: true });

  window.addEventListener("resize", updateScrollFeatures);

  updateScrollFeatures();


  // 5. BACK-TO-TOP BUTTON
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth"
    });
  });

});
