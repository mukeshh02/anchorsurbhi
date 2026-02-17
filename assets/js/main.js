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

  // Lightbox Implementation
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose = document.querySelector(".lightbox-close");
  const lbPrev = document.querySelector(".lightbox-prev");
  const lbNext = document.querySelector(".lightbox-next");
  const galleryImages = document.querySelectorAll(".gallery-grid img");

  if (lightbox && lbImg && galleryImages.length > 0) {
    let currentIndex = 0;
    const preloadedImages = new Map();

    const preloadImage = (index) => {
      const idx = (index + galleryImages.length) % galleryImages.length;
      if (preloadedImages.has(idx)) return;

      const imgData = galleryImages[idx];
      if (imgData instanceof HTMLImageElement) {
        const pImg = new Image();
        pImg.src = imgData.src;
        // Silent decode in background
        pImg.decode().then(() => preloadedImages.set(idx, pImg)).catch(() => { });
      }
    };

    const updateLightbox = (index) => {
      currentIndex = index;
      const originalImg = galleryImages[currentIndex];

      if (originalImg instanceof HTMLImageElement) {
        lightbox.classList.remove("is-loaded");
        lightbox.classList.add("is-loading");

        const showImage = () => {
          lbImg.src = originalImg.src;
          lbImg.alt = originalImg.alt;

          // Use decode with timeout fallback for the main image
          const decodePromise = lbImg.decode();
          const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500));

          Promise.race([decodePromise, timeoutPromise]).then(() => {
            lightbox.classList.remove("is-loading");
            lightbox.classList.add("is-loaded");

            // Predictive Preload neighbors
            preloadImage(currentIndex + 1);
            preloadImage(currentIndex - 1);
          });
        };

        // If already preloaded, use it immediately
        if (preloadedImages.has(currentIndex)) {
          showImage();
        } else {
          // Wait for a clean frame before starting the heavy load
          requestAnimationFrame(() => setTimeout(showImage, 10));
        }
      }
    };

    const openLightbox = (index) => {
      lightbox.classList.add("is-active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Show the viewer instantly, then load image
      requestAnimationFrame(() => {
        setTimeout(() => updateLightbox(index), 30);
      });
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-active", "is-loaded", "is-loading");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = ""; // Clear to free memory
    };

    const nextImage = () => updateLightbox((currentIndex + 1) % galleryImages.length);
    const prevImage = () => updateLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);

    galleryImages.forEach((img, index) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(index);
      });
    });

    lbClose?.addEventListener("click", e => { e.stopPropagation(); closeLightbox(); });
    lbPrev?.addEventListener("click", e => { e.stopPropagation(); prevImage(); });
    lbNext?.addEventListener("click", e => { e.stopPropagation(); nextImage(); });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
    });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });
  }
})();

