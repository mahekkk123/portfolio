
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. Automatically update the footer year
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile navigation menu
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  // 3. Smooth scrolling for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // 4. Reveal cards as they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // 5. Terminal typing animation
  const typedCommand = document.querySelector(".typed-command");
  const terminalOutput = document.getElementById("terminalOutput");

  if (typedCommand && terminalOutput) {
    const command = typedCommand.dataset.text || "whoami";
    const output = "cybersecurity-student";

    if (reduceMotion) {
      typedCommand.textContent = command;
      terminalOutput.textContent = output;
    } else {
      typedCommand.textContent = "";
      terminalOutput.textContent = "";
      terminalOutput.style.opacity = "0";

      let index = 0;

      const typeCharacter = () => {
        if (index < command.length) {
          typedCommand.textContent += command.charAt(index);
          index += 1;
          window.setTimeout(typeCharacter, 85);
        } else {
          window.setTimeout(() => {
            terminalOutput.textContent = output;
            terminalOutput.style.opacity = "1";
          }, 300);
        }
      };

      window.setTimeout(typeCharacter, 550);
    }
  }

  // 6. Interactive project filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectCount = document.getElementById("visibleProjectCount");

  function updateProjectCount(count) {
    if (projectCount) {
      projectCount.textContent = String(count).padStart(2, "0");
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";
      let visibleCount = 0;

      // Update the selected filter button
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      // Show only matching projects
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/);

        const shouldShow =
          selectedFilter === "all" ||
          categories.includes(selectedFilter);

        card.classList.toggle("filter-hidden", !shouldShow);

        if (shouldShow) {
          visibleCount += 1;
          card.classList.add("visible");
        }
      });

      updateProjectCount(visibleCount);
    });
  });

  updateProjectCount(projectCards.length);

  console.log("Portfolio initialized successfully.");
});
