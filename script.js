(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const yearEl = document.getElementById("year");
  const progressBar = document.getElementById("progress-bar");
  const backToTop = document.getElementById("back-to-top");

  // Footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Reading progress bar
  function updateProgress() {
    if (!progressBar) return;
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = height > 0 ? (winScroll / height) * 100 + "%" : "0%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Back to top visibility and click
  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Header scroll state
  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Active nav link based on scroll position
  const sectionIds = ["about", "skills", "projects", "experience", "education", "contact"];

  function setActiveNav() {
    const scrollY = window.scrollY;
    const viewportMid = scrollY + window.innerHeight * 0.35;

    let activeId = "";
    sectionIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (viewportMid >= top && viewportMid < top + height) {
        activeId = id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      const targetId = href && href.startsWith("#") ? href.slice(1) : "";
      if (targetId === activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  window.addEventListener("load", setActiveNav);
  setActiveNav();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("open");
      document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Section scroll reveal
  const sections = document.querySelectorAll(".section");
  const observerOptions = { rootMargin: "0px 0px -80px 0px", threshold: 0.05 };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // 3D tilt on cards (skill-card, project-card)
  function initTilt(cardSelector) {
    const cards = document.querySelectorAll(cardSelector);
    const tiltStrength = 8;
    const tiltSmooth = 0.15;

    cards.forEach(function (card) {
      var base = card.classList.contains("skill-card") ? "translateY(-6px)" : "translateX(8px)";
      card.addEventListener("mouseenter", function () {
        card.classList.add("tilt");
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) " + base;
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilt");
        card.style.transform = "";
      });
      card.addEventListener("mousemove", function (e) {
        if (!card.classList.contains("tilt")) return;
        var rect = card.getBoundingClientRect();
        var rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -tiltStrength;
        var rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * tiltStrength;
        card.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) " + base;
      });
    });
  }

  if (window.matchMedia("(hover: hover)").matches) {
    initTilt(".skill-card");
    initTilt(".project-card");
  }
})();
