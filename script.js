/* American Dream Coin — interactions */

(function () {
  "use strict";

  /* -------------------- 1. Copy contract address -------------------- */
  const copyBtn = document.getElementById("ca-copy-btn");
  const caText = document.getElementById("ca-text");
  const toast = document.getElementById("copy-toast");

  if (copyBtn && caText) {
    copyBtn.addEventListener("click", async () => {
      const value = caText.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const range = document.createRange();
          range.selectNodeContents(caText);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand("copy");
          sel.removeAllRanges();
        }
        showToast("Contract address copied ★");
        copyBtn.classList.add("is-copied");
        const label = copyBtn.querySelector(".ca-copy-label");
        if (label) {
          const old = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => {
            label.textContent = old;
            copyBtn.classList.remove("is-copied");
          }, 1800);
        }
      } catch (e) {
        showToast("Couldn't copy — try manually.");
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-show"), 2200);
  }

  /* -------------------- 2. Chart resolution buttons -------------------- */
  const resBtns = document.querySelectorAll(".chart-resolutions .res");
  resBtns.forEach((b) =>
    b.addEventListener("click", () => {
      resBtns.forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
    })
  );

  /* -------------------- 3. Mock price ticker -------------------- */
  const priceEl = document.getElementById("stat-price");
  if (priceEl) {
    let p = 0.000176;
    setInterval(() => {
      const drift = (Math.random() - 0.45) * 0.000008;
      p = Math.max(0.00001, p + drift);
      priceEl.textContent = "$" + p.toFixed(7);
    }, 1600);
  }

  /* -------------------- 5. Reveal-on-scroll for section cards -------------------- */
  const revealEls = document.querySelectorAll(
    ".how-note, .road-step, .token-card, .index-hero, .index-stat, .index-cta, .chart-card, .final-card"
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = `heroFadeUp .8s cubic-bezier(.22,1,.36,1) forwards`;
            entry.target.style.animationDelay = `${Math.min(i, 6) * 0.07}s`;
            entry.target.style.opacity = 0;
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => {
      el.style.opacity = 0;
      io.observe(el);
    });
  }

  /* -------------------- 7. Subtle parallax on orbs -------------------- */
  const orbs = document.querySelectorAll(".orb");
  let mouseX = 0, mouseY = 0, rafQueued = false;
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rafQueued) {
        rafQueued = true;
        requestAnimationFrame(applyParallax);
      }
    },
    { passive: true }
  );
  function applyParallax() {
    rafQueued = false;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 10;
      orb.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
    });
  }

  /* -------------------- 7b. Divergence chart (housing vs. income) -------------------- */
  const divergenceData = [
    { year: 1970, house: 23000,  income: 9870  },
    { year: 1975, house: 39300,  income: 13720 },
    { year: 1980, house: 62900,  income: 21020 },
    { year: 1985, house: 84300,  income: 27735 },
    { year: 1990, house: 123900, income: 35353 },
    { year: 1995, house: 133900, income: 40611 },
    { year: 2000, house: 169000, income: 50732 },
    { year: 2005, house: 240900, income: 56194 },
    { year: 2010, house: 221800, income: 60236 },
    { year: 2015, house: 294000, income: 62983 },
    { year: 2020, house: 329000, income: 67521 },
    { year: 2022, house: 397100, income: 74580 },
    { year: 2024, house: 415000, income: 77790 },
    { year: 2026, house: 432000, income: 79500 },
  ];

  const chartWrap = document.getElementById("divergence-chart");
  if (chartWrap) {
    const svg = chartWrap.querySelector(".comp-svg");
    const VB_W = 800, VB_H = 320;
    const PAD_L = 50, PAD_R = 20, PAD_T = 20, PAD_B = 40;
    const innerW = VB_W - PAD_L - PAD_R;
    const innerH = VB_H - PAD_T - PAD_B;

    const minYear = divergenceData[0].year;
    const maxYear = divergenceData[divergenceData.length - 1].year;
    const maxVal = 450000;

    const xFor = (year) =>
      PAD_L + ((year - minYear) / (maxYear - minYear)) * innerW;
    const yFor = (val) =>
      PAD_T + innerH - (val / maxVal) * innerH;

    const housePts = divergenceData.map((d) => [xFor(d.year), yFor(d.house)]);
    const incomePts = divergenceData.map((d) => [xFor(d.year), yFor(d.income)]);

    const toPath = (pts) =>
      pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
    const toArea = (pts) =>
      toPath(pts) +
      ` L${pts[pts.length - 1][0]},${PAD_T + innerH} L${pts[0][0]},${PAD_T + innerH} Z`;

    svg.querySelector("#house-line").setAttribute("d", toPath(housePts));
    svg.querySelector("#income-line").setAttribute("d", toPath(incomePts));
    svg.querySelector("#house-area").setAttribute("d", toArea(housePts));
    svg.querySelector("#income-area").setAttribute("d", toArea(incomePts));

    const gridGroup = svg.querySelector("#chart-grid-lines");
    const yLabels = svg.querySelector("#chart-y-labels");
    const ySteps = [0, 100000, 200000, 300000, 400000];
    ySteps.forEach((v) => {
      const y = yFor(v);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", PAD_L);
      line.setAttribute("y1", y);
      line.setAttribute("x2", VB_W - PAD_R);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(231, 172, 8, 0.08)");
      gridGroup.appendChild(line);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", PAD_L - 10);
      label.setAttribute("y", y + 4);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("fill", "var(--cream-faint)");
      label.setAttribute("font-size", "10");
      label.setAttribute("font-family", "var(--font-data)");
      label.textContent = v === 0 ? "$0" : "$" + v / 1000 + "k";
      yLabels.appendChild(label);
    });

    const xLabels = svg.querySelector("#chart-x-labels");
    const xTicks = [1970, 1980, 1990, 2000, 2010, 2020, 2026];
    xTicks.forEach((year) => {
      const x = xFor(year);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x);
      label.setAttribute("y", VB_H - PAD_B + 20);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", "var(--cream-faint)");
      label.setAttribute("font-size", "10");
      label.setAttribute("font-family", "var(--font-data)");
      label.textContent = year;
      xLabels.appendChild(label);
    });

    const hoverLine = svg.querySelector("#hover-line");
    const houseDot = svg.querySelector("#hover-house-dot");
    const incomeDot = svg.querySelector("#hover-income-dot");
    const tooltip = document.getElementById("chart-tooltip");
    const ttYear = tooltip.querySelector(".tooltip-year");
    const ttHouse = tooltip.querySelector(".tt-house");
    const ttIncome = tooltip.querySelector(".tt-income");
    const ttRatio = tooltip.querySelector(".tt-ratio");

    const fmtMoney = (n) =>
      "$" + Math.round(n).toLocaleString("en-US");

    function interp(year) {
      if (year <= minYear) return divergenceData[0];
      if (year >= maxYear) return divergenceData[divergenceData.length - 1];
      for (let i = 0; i < divergenceData.length - 1; i++) {
        const a = divergenceData[i], b = divergenceData[i + 1];
        if (year >= a.year && year <= b.year) {
          const t = (year - a.year) / (b.year - a.year);
          return {
            year,
            house: a.house + (b.house - a.house) * t,
            income: a.income + (b.income - a.income) * t,
          };
        }
      }
      return divergenceData[divergenceData.length - 1];
    }

    function handleMove(clientX, clientY) {
      const rect = chartWrap.getBoundingClientRect();
      const relX = ((clientX - rect.left) / rect.width) * VB_W;
      if (relX < PAD_L || relX > VB_W - PAD_R) {
        hideHover();
        return;
      }
      const yearF = minYear + ((relX - PAD_L) / innerW) * (maxYear - minYear);
      const year = Math.round(yearF);
      const pt = interp(year);
      const x = xFor(pt.year);
      const yH = yFor(pt.house);
      const yI = yFor(pt.income);

      hoverLine.setAttribute("x1", x);
      hoverLine.setAttribute("x2", x);
      hoverLine.style.opacity = 1;
      houseDot.setAttribute("cx", x);
      houseDot.setAttribute("cy", yH);
      houseDot.style.opacity = 1;
      incomeDot.setAttribute("cx", x);
      incomeDot.setAttribute("cy", yI);
      incomeDot.style.opacity = 1;

      ttYear.textContent = pt.year;
      ttHouse.textContent = fmtMoney(pt.house);
      ttIncome.textContent = fmtMoney(pt.income);
      ttRatio.textContent = (pt.house / pt.income).toFixed(2) + "×";

      const xRatio = x / VB_W;
      const tipLeft = xRatio * rect.width;
      const tipWidth = tooltip.offsetWidth || 180;
      const maxLeft = rect.width - tipWidth - 12;
      const useLeft = Math.min(Math.max(12, tipLeft - tipWidth / 2), maxLeft);
      tooltip.style.left = useLeft + "px";
      tooltip.style.opacity = 1;
    }

    function hideHover() {
      hoverLine.style.opacity = 0;
      houseDot.style.opacity = 0;
      incomeDot.style.opacity = 0;
      tooltip.style.opacity = 0;
    }

    chartWrap.addEventListener("mousemove", (e) => handleMove(e.clientX, e.clientY));
    chartWrap.addEventListener("mouseleave", hideHover);
    chartWrap.addEventListener("touchmove", (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    chartWrap.addEventListener("touchend", hideHover);
  }

  /* -------------------- 7c. Hero dissolve + transparent navbar on scroll -------------------- */
  const heroBg = document.querySelector(".hero-bg");
  const heroSection = document.querySelector(".hero");
  const nav = document.querySelector(".nav");
  let scrollQueued = false;

  const onScroll = () => {
    scrollQueued = false;
    if (heroBg && heroSection) {
      const heroHeight = heroSection.offsetHeight || window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / (heroHeight * 0.85), 0), 1);
      heroBg.style.opacity = String(1 - progress);
    }
    if (nav) {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    }
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* -------------------- 8. Smooth scroll polish -------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* -------------------- 9. Mobile nav menu -------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("primary-nav");

  if (navToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("is-menu-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    if (navLinks) {
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });
    }

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-menu-open")) return;
      if (nav.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }
})();
