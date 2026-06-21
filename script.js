/* ============================================================
   Sherwin Galindo — Portfolio interactions
   Vanilla JavaScript only. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------
     1. HEADER — solid on scroll
  ---------------------------------------------------------- */
  var header = document.getElementById("header");
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add("is-solid");
    else header.classList.remove("is-solid");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ----------------------------------------------------------
     2. MOBILE MENU
  ---------------------------------------------------------- */
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  function toggleMenu(open) {
    var willOpen =
      typeof open === "boolean" ? open : !mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", willOpen);
    hamburger.classList.toggle("is-open", willOpen);
    hamburger.setAttribute("aria-expanded", String(willOpen));
    mobileMenu.setAttribute("aria-hidden", String(!willOpen));
    document.body.style.overflow = willOpen ? "hidden" : "";
  }
  hamburger.addEventListener("click", function () {
    toggleMenu();
  });
  Array.prototype.forEach.call(
    document.querySelectorAll(".mobile-menu__link"),
    function (link) {
      link.addEventListener("click", function () {
        toggleMenu(false);
      });
    }
  );
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggleMenu(false);
  });

  /* ----------------------------------------------------------
     3. SMOOTH ANCHOR SCROLL (with header offset)
  ---------------------------------------------------------- */
  Array.prototype.forEach.call(
    document.querySelectorAll('a[href^="#"]'),
    function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = this.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = 64;
        var top =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: top,
          behavior: prefersReduced ? "auto" : "smooth"
        });
      });
    }
  );

  var toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ----------------------------------------------------------
     4. PORTFOLIO — build cards + auto thumbnails
  ---------------------------------------------------------- */
  var projects = [
    { name: "86 West", url: "https://the86west.com/", tag: "Restaurant" },
    { name: "Digital One Reviews", url: "https://digitalonereviews.com/", tag: "SaaS" },
    { name: "Danielson Land Co", url: "https://danielsonlandco.com/", tag: "Real Estate" },
    { name: "Geerlings Garden Center", url: "http://geerlingsgardencenter.com/", tag: "Retail" },
    { name: "Pack 'N' Mail", url: "https://packnmailttx.com/", tag: "Services" },
    { name: "Waterside Cafe & Diner", url: "https://watersidecafeanddiner.com/", tag: "Restaurant" },
    { name: "Jamison Carpets", url: "https://jamisoncarpets.com/", tag: "Retail" },
    { name: "Salon Anna Noelle", url: "https://salonannanoelle.com/", tag: "Beauty" },
    { name: "Amalio's Pizza & Pasta", url: "https://amaliospizzaandpasta.com/", tag: "Restaurant" },
    { name: "Adagio Seafood", url: "https://seafoodadagio.com/", tag: "Restaurant" },
    { name: "Weinrich Bakery", url: "https://weinrichbakery.com/", tag: "Bakery" },
    { name: "Steve Stein's Famous Deli", url: "https://steinsfamousdeli.com/", tag: "Restaurant" },
    { name: "Dagwood's Pub", url: "https://dagwoodspub.com/", tag: "Pub" },
    { name: "The Borough Pub", url: "https://theboroughpub.com/", tag: "Pub" },
    { name: "Bailey's Bar & Grille", url: "https://baileysbarandgrillpa.com/", tag: "Bar & Grill" },
    { name: "Farmhouse Tavern", url: "https://farmhousetavern.com/", tag: "Tavern" },
    { name: "Buona Via", url: "https://buonavia.com/", tag: "Restaurant" },
    { name: "HG Bucks Bagels", url: "https://hgbucksbagels.com/", tag: "Bakery" },
    { name: "Nico's Pizza Jamison", url: "https://nicospizzajamison.com/", tag: "Restaurant" },
    { name: "Jamison Pour House", url: "https://jamisonpourhouse.com/", tag: "Pub" },
    { name: "Roots Restaurants", url: "https://rootsrestaurants.com/", tag: "Restaurant" },
    { name: "New Britain Inn", url: "https://newbritaininn.com/", tag: "Hospitality" },
    { name: "Station Taphouse", url: "https://thestationtaphouse.com/", tag: "Tavern" },
    { name: "Taormina's Ivyland", url: "https://taorminasivyland.com/", tag: "Restaurant" },
    { name: "Crossroads Tavern", url: "https://xroadstavern.com/", tag: "Tavern" },
    { name: "Oneals Pub", url: "https://onealspub.com/", tag: "Pub" },
    { name: "Whiskey Girl Saloon", url: "https://thewhiskeygirlsaloon.com/", tag: "Bar" },
    { name: "Pocos", url: "https://pocos.com/", tag: "Restaurant" },
    { name: "Patriot Landscaping", url: "https://patriotlandscapenh.com/", tag: "Landscaping" },
    { name: "Tex Mex Connection", url: "https://texmexconnection.com/", tag: "Restaurant" }
  ];

  function initials(name) {
    return name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (w) {
        return w.charAt(0).toUpperCase();
      })
      .join("");
  }

  function thumbUrl(url) {
    // WordPress mShots — free, keyless screenshot service. Generates a
    // preview image directly from the live site URL.
    return (
      "https://s0.wp.com/mshots/v1/" +
      encodeURIComponent(url) +
      "?w=800&h=600"
    );
  }

  var grid = document.getElementById("portfolioGrid");
  var cards = [];

  if (grid) {
    var frag = document.createDocumentFragment();

    projects.forEach(function (p) {
      var card = document.createElement("article");
      card.className = "pcard";

      var fallback =
        '<div class="pcard__fallback" aria-hidden="true">' +
        initials(p.name) +
        "</div>";

      card.innerHTML =
        '<div class="pcard__media">' +
        '<img class="pcard__img" loading="lazy" decoding="async" width="800" height="600"' +
        ' alt="' +
        p.name +
        " website preview\" src=\"" +
        thumbUrl(p.url) +
        '" />' +
        '<div class="pcard__overlay">' +
        '<a class="pcard__visit" href="' +
        p.url +
        '" target="_blank" rel="noopener noreferrer">Visit Website &#8599;</a>' +
        "</div>" +
        "</div>" +
        '<div class="pcard__body">' +
        '<h3 class="pcard__name">' +
        p.name +
        "</h3>" +
        '<span class="pcard__tag">' +
        p.tag +
        "</span>" +
        "</div>";

      // Graceful fallback if the screenshot fails to load
      var img = card.querySelector(".pcard__img");
      img.addEventListener("error", function handleErr() {
        var media = card.querySelector(".pcard__media");
        var overlay = card.querySelector(".pcard__overlay");
        img.remove();
        media.insertAdjacentHTML("afterbegin", fallback);
        if (overlay) media.appendChild(overlay);
      });

      frag.appendChild(card);
      cards.push(card);
    });

    grid.appendChild(frag);
  }

  /* ----------------------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  function revealAll(nodes) {
    Array.prototype.forEach.call(nodes, function (n) {
      n.classList.add("is-in");
    });
  }

  var revealTargets = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    var revObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    Array.prototype.forEach.call(revealTargets, function (t) {
      revObserver.observe(t);
    });

    // Portfolio cards — staggered entrance
    var cardObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay =
              (Array.prototype.indexOf.call(cards, el) % 3) * 90;
            setTimeout(function () {
              el.classList.add("is-in");
            }, delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach(function (c) {
      cardObserver.observe(c);
    });
  } else {
    revealAll(revealTargets);
    revealAll(cards);
  }

  /* ----------------------------------------------------------
     6. COUNTERS
  ---------------------------------------------------------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutExpo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll(".metric__num");
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    Array.prototype.forEach.call(counters, function (c) {
      countObserver.observe(c);
    });
  } else {
    Array.prototype.forEach.call(counters, animateCounter);
  }

  /* ----------------------------------------------------------
     7. ACTIVE NAV LINK ON SCROLL
  ---------------------------------------------------------- */
  var sections = ["home", "about", "services", "portfolio", "contact"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  var navLinks = document.querySelectorAll(".nav__link");

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            Array.prototype.forEach.call(navLinks, function (link) {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" }
    );
    sections.forEach(function (s) {
      navObserver.observe(s);
    });
  }

  /* ----------------------------------------------------------
     8. HERO ANIMATED BACKGROUND (canvas particles + links)
  ---------------------------------------------------------- */
  var canvas = document.getElementById("heroCanvas");
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h;
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var rafId = null;

    function resize() {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      var count = Math.min(Math.floor((w * h) / 16000), 90);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.4
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // mouse parallax attraction
        var dxm = mouse.x - p.x;
        var dym = mouse.y - p.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 140) {
          p.x -= dxm * 0.002;
          p.y -= dym * 0.002;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x;
          var dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(255,255,255," + (0.12 * (1 - dist / 120)) + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    function start() {
      if (!rafId) draw();
    }
    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    window.addEventListener(
      "mousemove",
      function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      },
      { passive: true }
    );
    window.addEventListener("mouseout", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    // Pause when hero is offscreen to save CPU
    if ("IntersectionObserver" in window) {
      var heroObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) start();
            else stop();
          });
        },
        { threshold: 0 }
      );
      heroObs.observe(canvas);
    }

    resize();
    start();
  }

  /* ----------------------------------------------------------
     9. CONTACT FORM — AJAX submit via FormSubmit
  ---------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      // Honeypot check
      if (form.querySelector('[name="_honey"]').value) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending...";
      note.textContent = "";
      note.className = "form__note";

      var data = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            note.textContent =
              "Thank you. Your inquiry has been sent — I'll reply shortly.";
            note.className = "form__note ok";
          } else {
            return res.json().then(function (d) {
              throw new Error((d && d.message) || "Submission failed");
            });
          }
        })
        .catch(function () {
          note.textContent =
            "Something went wrong. Please email sherwingalindo18@gmail.com directly.";
          note.className = "form__note err";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }

  /* ----------------------------------------------------------
     10. YEAR (footer safety — keeps copyright current if needed)
  ---------------------------------------------------------- */
  // Static 2026 per brief; no dynamic override required.
})();
