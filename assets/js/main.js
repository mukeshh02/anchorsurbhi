(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  // Header style changes after scroll to make it feel like a "menu bar".
  if (header instanceof HTMLElement) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && nav) {
    const close = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (nav.contains(target) || toggle.contains(target)) return;
      close();
    });

    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches("a[href^='#'], a[href^='./#'], a[href^='/#']")) close();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Improve anchor scrolling with sticky header offset.
  const anchorLinks = document.querySelectorAll("a[href^='#']");
  anchorLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!(el instanceof HTMLElement)) return;
      e.preventDefault();

      const headerH = header instanceof HTMLElement ? header.offsetHeight : 0;
      const y = el.getBoundingClientRect().top + window.scrollY - headerH - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", href);
    });
  });
})();

