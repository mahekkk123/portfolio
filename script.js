
/* =========================================
   MAHEK KHAN - PORTFOLIO INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ===== ROBOT INTRO =====
  const introScreen = document.getElementById("introScreen");
  const enterButton = document.getElementById("enterPortfolio");
  const skipButton = document.getElementById("skipIntro");
  const robotBuddy = document.getElementById("robotBuddy");

  function enterPortfolio() {
    if (!introScreen || introScreen.classList.contains("is-hidden")) {
      return;
    }

    introScreen.classList.add("is-hidden");

    window.setTimeout(() => {
      introScreen.remove();
    }, 700);
  }

  if (enterButton) {
    enterButton.addEventListener("click", enterPortfolio);
  }

  if (skipButton) {
    skipButton.addEventListener("click", enterPortfolio);
  }

  // Robot reacts when clicked.
  if (robotBuddy) {
    robotBuddy.addEventListener("click", () => {
      if (typeof robotBuddy.animate !== "function") return;

      robotBuddy.animate(
        [
          { transform: "scale(1) rotate(0deg)" },
          { transform: "scale(1.06) rotate(-3deg)" },
          { transform: "scale(1) rotate(0deg)" }
        ],
        {
          duration: 350,
          easing: "ease-out"
        }
      );
    });
  }

  // ===== MOBILE NAVIGATION =====
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // ===== PROJECT FILTERS =====
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/);
        const shouldShow =
          selectedFilter === "all" || categories.includes(selectedFilter);

        card.hidden = !shouldShow;
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // ===== CURRENT YEAR =====
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ===== NAVIGATION SECTION HIGHLIGHT =====
  const sections = document.querySelectorAll(
    "main section[id]"
  );
  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isCurrent);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});
