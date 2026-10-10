
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("introScreen");
  const enterButton = document.getElementById("enterPortfolio");
  const skipButton = document.getElementById("skipIntro");
  const robot = document.getElementById("robotBuddy");
  const searchInput = document.getElementById("projectSearch");
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const projectCards = [...document.querySelectorAll(".project-card")];
  const projectCount = document.getElementById("projectCount");
  const emptyState = document.getElementById("emptyState");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const terminalForm = document.getElementById("terminalForm");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");

  // Welcome screen
  document.body.classList.add("intro-open");

  function closeIntro() {
    if (!intro || intro.classList.contains("hidden")) return;
    intro.classList.add("hidden");
    document.body.classList.remove("intro-open");
  }

  enterButton?.addEventListener("click", closeIntro);
  skipButton?.addEventListener("click", closeIntro);

  robot?.addEventListener("click", () => {
    const smile = robot.querySelector(".robot-smile");
    if (smile) {
      smile.style.borderBottomWidth = "4px";
      setTimeout(() => smile.style.borderBottomWidth = "2px", 500);
    }
  });

  // Project search + category filters
  let activeCategory = "all";

  function filterProjects() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = (card.dataset.category || "").split(/\s+/);
      const text = (
        (card.dataset.search || "") + " " + card.textContent
      ).toLowerCase();

      const categoryMatches =
        activeCategory === "all" || category.includes(activeCategory);
      const searchMatches = text.includes(query);
      const visible = categoryMatches && searchMatches;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (projectCount) {
      projectCount.textContent =
        `Showing ${visibleCount} of ${projectCards.length} projects`;
    }

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  searchInput?.addEventListener("input", filterProjects);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      filterProjects();
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  filterProjects();

  // Mobile navigation
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open") || false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.textContent = "☰";
    });
  });

  // Active navigation link
  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks?.querySelectorAll("a").forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });

    sections.forEach((section) => observer.observe(section));
  }

  // Terminal commands
  const commands = {
    help: () => [
      "Available commands:",
      "about    - Learn about Mahek",
      "skills   - View learning areas",
      "projects - Explore project portfolio",
      "clear    - Clear terminal output"
    ],
    about: () => [
      "Name: Mahek Khan",
      "Field: Computer Engineering",
      "Interest: Cybersecurity and building practical projects",
      "Status: Always learning."
    ],
    skills: () => [
      "Python - learning and project practice",
      "Linux - command-line fundamentals",
      "Networking - ports and TCP/IP basics",
      "Security - encryption and defensive concepts",
      "Web - HTML, CSS, JavaScript"
    ],
    projects: () => [
      `${projectCards.length} portfolio projects are listed.`,
      "Scroll to the Projects section to search and filter them."
    ]
  };

  function addTerminalLine(text, className = "") {
    const line = document.createElement("p");
    line.textContent = text;
    if (className) line.className = className;
    terminalOutput?.appendChild(line);
  }

  terminalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = (terminalInput?.value || "").trim().toLowerCase();
    if (!command || !terminalOutput) return;

    addTerminalLine(`visitor@cyber:~$ ${command}`, "terminal-command");
    if (command === "clear") {
      terminalOutput.replaceChildren();
    } else if (commands[command]) {
      commands[command]().forEach((line) => addTerminalLine(line));
    } else {
      addTerminalLine(`Command not found: ${command}. Type "help" for options.`);
    }

    terminalInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });

  // Footer year
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
});
