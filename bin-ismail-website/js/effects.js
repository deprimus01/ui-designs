(function () {
  var d = document,
    H = d.documentElement,
    rm = matchMedia("(prefers-reduced-motion:reduce)").matches,
    fine = matchMedia("(hover:hover) and (pointer:fine)").matches,
    EZ = "cubic-bezier(.2,.8,.2,1)";
  var lite =
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  if (lite) H.classList.add("fx-lite");
  function $$(s, c) {
    return [].slice.call((c || d).querySelectorAll(s));
  }

  /* scroll progress + nav shadow */
  var bar = d.createElement("div");
  bar.className = "fx-bar";
  bar.setAttribute("aria-hidden", "true");
  d.body.appendChild(bar);
  var nav = d.querySelector(".nav-wrap"),
    tk = false,
    sh = 0,
    gen = 0;
  function meas() {
    sh = H.scrollHeight - innerHeight;
  }
  meas();
  if ("ResizeObserver" in window)
    new ResizeObserver(meas).observe(d.body);
  addEventListener("resize", meas);
  function onS() {
    var h = sh,
      p = h > 0 ? Math.min(1, scrollY / h) : 0;
    bar.style.clipPath =
      "inset(0 " + (100 - p * 100).toFixed(2) + "% 0 0)";
    if (nav) nav.classList.toggle("fx-s", scrollY > 12);
    tk = false;
  }
  addEventListener(
    "scroll",
    function () {
      gen++;
      if (!tk) {
        tk = true;
        requestAnimationFrame(onS);
      }
    },
    { passive: true },
  );
  onS();

  /* scroll reveal */
  if (!rm && "IntersectionObserver" in window) {
    var sel =
      ".sec .lb,.sec h2,.sec .lead,.svc-i,.cats .tile,.grid .p,.row,.pack,.why>div,.steps>li,.faq details,.nfc,.rev,.form,.sub,.cl";
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("fx-on");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    H.classList.add("fx");
    $$(sel).forEach(function (el) {
      var sib = [].filter.call(el.parentNode.children, function (c) {
        return c.matches(sel);
      });
      el.style.setProperty(
        "--d",
        Math.min(sib.indexOf(el), 7) * 70 + "ms",
      );
      el.classList.add("fx-in");
      io.observe(el);
    });
  }

  /* scrollspy */
  if ("IntersectionObserver" in window) {
    var links = $$("#links a"),
      map = {};
    links.forEach(function (a) {
      map[a.getAttribute("href")] = a;
    });
    var sp = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) {
              a.classList.remove("cur");
            });
            var a = map["#" + e.target.id];
            if (a) a.classList.add("cur");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.keys(map).forEach(function (h) {
      var s = h.length > 1 && d.querySelector(h);
      if (s) sp.observe(s);
    });
  }

  /* tilt cards + magnetic buttons (mouse only) */
  if (fine && !rm && !lite) {
    $$(".grid .p,.cats .tile,.pack").forEach(function (el) {
      var raf,
        b,
        g = -1;
      el.classList.add("fx-t");
      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        if (!b || g !== gen) {
          b = el.getBoundingClientRect();
          g = gen;
        }
        var px = (e.clientX - b.left) / b.width,
          py = (e.clientY - b.top) / b.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.setProperty(
            "--rx",
            ((0.5 - py) * 7).toFixed(2) + "deg",
          );
          el.style.setProperty(
            "--ry",
            ((px - 0.5) * 9).toFixed(2) + "deg",
          );
          el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        });
      });
      el.addEventListener("pointerleave", function () {
        b = null;
        cancelAnimationFrame(raf);
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
    $$(".btn-primary,.btn-wa").forEach(function (b) {
      b.classList.add("fx-m");
      var r0;
      b.addEventListener("pointerenter", function () {
        b.style.translate = "";
        r0 = b.getBoundingClientRect();
      });
      b.addEventListener("pointermove", function (e) {
        var r = r0 || b.getBoundingClientRect();
        b.style.translate =
          ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) +
          "px " +
          ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) +
          "px";
      });
      b.addEventListener("pointerleave", function () {
        b.style.translate = "";
      });
    });
  }

  /* click ripple */
  if (!rm)
    d.addEventListener(
      "pointerdown",
      function (e) {
        var t =
          e.target.closest &&
          e.target.closest(".btn,.chp,.seg button,.go,.icon-btn,.row");
        if (!t) return;
        var r = t.getBoundingClientRect(),
          s = Math.max(r.width, r.height) * 2.2,
          p = d.createElement("span");
        p.className = "fx-rip";
        p.style.cssText =
          "width:" +
          s +
          "px;height:" +
          s +
          "px;left:" +
          (e.clientX - r.left - s / 2) +
          "px;top:" +
          (e.clientY - r.top - s / 2) +
          "px";
        t.appendChild(p);
        setTimeout(function () {
          p.remove();
        }, 700);
      },
      { passive: true },
    );

  /* filter: staggered pop-in */
  function pop(seg) {
    $$(seg === "work" ? "#grid .p" : "#rows .row")
      .filter(function (c) {
        return !c.hidden;
      })
      .forEach(function (c, i) {
        c.classList.remove("fx-pop");
        c.classList.add("fx-on");
        c.style.setProperty("--d", Math.min(i, 10) * 45 + "ms");
        void c.offsetWidth;
        c.classList.add("fx-pop");
      });
  }
  if (!rm) {
    $$(".seg button").forEach(function (b) {
      b.addEventListener("click", function () {
        pop(b.parentNode.dataset.target);
      });
    });
    $$(".cats a[data-f]").forEach(function (a) {
      a.addEventListener("click", function () {
        pop("work");
      });
    });
  }

  /* theme switch: circular wipe from the button */
  var tb = d.getElementById("theme");
  if (tb)
    tb.onclick = function () {
      var cur = H.dataset.theme
          ? H.dataset.theme === "dark"
          : matchMedia("(prefers-color-scheme: dark)").matches,
        t = cur ? "light" : "dark";
      function ap() {
        H.dataset.theme = t;
        try {
          localStorage.setItem("theme", t);
        } catch (e) {}
        tb.innerHTML =
          '<i class="fa-solid fa-' +
          (t === "dark" ? "sun" : "moon") +
          '" aria-hidden="true"></i>';
        var ic = tb.firstChild;
        if (!rm && ic && ic.animate) {
          ic.style.display = "inline-block";
          ic.animate(
            [
              { transform: "rotate(-100deg) scale(.3)", opacity: 0 },
              { transform: "none", opacity: 1 },
            ],
            { duration: 550, easing: EZ },
          );
        }
      }
      if (!rm && !lite && d.startViewTransition) {
        var b = tb.getBoundingClientRect(),
          x = b.left + b.width / 2,
          y = b.top + b.height / 2,
          R = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
          ),
          vt = d.startViewTransition(ap);
        vt.ready
          .then(function () {
            H.animate(
              {
                clipPath: [
                  "circle(0px at " + x + "px " + y + "px)",
                  "circle(" + R + "px at " + x + "px " + y + "px)",
                ],
              },
              {
                duration: 650,
                easing: EZ,
                pseudoElement: "::view-transition-new(root)",
              },
            );
          })
          .catch(function () {});
      } else ap();
    };

  /* NFC demo: tap the phone to replay */
  var demo = d.getElementById("demo");
  if (demo)
    demo.addEventListener("click", function () {
      var r = d.getElementById("replay");
      if (r) r.click();
    });

  /* lightbox for the work grid */
  var grid = d.getElementById("grid");
  if (grid) {
    var cards = [],
      idx = 0,
      lastF = null,
      lb = d.createElement("div");
    lb.className = "fx-lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Work preview");
    lb.innerHTML =
      '<div class="fx-lb-bg"></div><button class="fx-lb-n fx-lb-p" type="button" aria-label="Previous"><i class="fa-solid fa-chevron-right" style="display:inline-block;transform:scaleX(-1)" aria-hidden="true"></i></button><figure class="fx-lb-f"><img alt=""><figcaption><b></b><a class="btn btn-wa btn-sm" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Order this</a></figcaption></figure><button class="fx-lb-n fx-lb-nx" type="button" aria-label="Next"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button><button class="fx-lb-x" type="button" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';
    d.body.appendChild(lb);
    var li = lb.querySelector("img"),
      ti = lb.querySelector("b"),
      od = lb.querySelector("figcaption a"),
      cx = lb.querySelector(".fx-lb-x");
    function fill(c) {
      var im = c.querySelector("img"),
        g = c.querySelector(".go"),
        h = c.querySelector(".chip b");
      li.src = im.currentSrc || im.src;
      li.alt = im.alt;
      ti.textContent = h ? h.textContent : "";
      if (g) od.href = g.href;
    }
    function openLB(c) {
      var im = c.querySelector("img");
      if (!im || !(im.currentSrc || im.src)) return;
      cards = $$("#grid .p").filter(function (x) {
        return !x.hidden;
      });
      idx = cards.indexOf(c);
      lastF = d.activeElement;
      var from = im.getBoundingClientRect();
      fill(c);
      function go() {
        lb.classList.add("on");
        H.style.overflow = "hidden";
        cx.focus({ preventScroll: true });
        if (!rm && li.animate && from.width) {
          var to = li.getBoundingClientRect();
          if (to.width)
            li.animate(
              [
                {
                  transform:
                    "translate(" +
                    (from.left +
                      from.width / 2 -
                      to.left -
                      to.width / 2) +
                    "px," +
                    (from.top +
                      from.height / 2 -
                      to.top -
                      to.height / 2) +
                    "px) scale(" +
                    from.width / to.width +
                    ")",
                  opacity: 0.4,
                },
                { transform: "none", opacity: 1 },
              ],
              { duration: 480, easing: EZ },
            );
        }
      }
      if (li.decode) li.decode().then(go, go);
      else go();
    }
    function closeLB() {
      if (!lb.classList.contains("on")) return;
      lb.classList.remove("on");
      H.style.overflow = "";
      if (lastF && lastF.focus) lastF.focus({ preventScroll: true });
    }
    function step(n) {
      if (cards.length < 2) return;
      idx = (idx + n + cards.length) % cards.length;
      fill(cards[idx]);
      if (!rm && li.animate)
        li.animate(
          [
            { opacity: 0, transform: "translateX(" + n * 36 + "px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 330, easing: EZ },
        );
    }
    $$("#grid .p").forEach(function (c) {
      c.tabIndex = 0;
      c.setAttribute("aria-haspopup", "dialog");
    });
    grid.addEventListener("click", function (e) {
      if (e.target.closest(".go")) return;
      var c = e.target.closest(".p");
      if (c) openLB(c);
    });
    grid.addEventListener("keydown", function (e) {
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.classList.contains("p")
      ) {
        e.preventDefault();
        openLB(e.target);
      }
    });
    lb.addEventListener("click", function (e) {
      var t = e.target;
      if (t === lb || t.classList.contains("fx-lb-bg")) closeLB();
    });
    cx.onclick = closeLB;
    lb.querySelector(".fx-lb-p").onclick = function () {
      step(-1);
    };
    lb.querySelector(".fx-lb-nx").onclick = function () {
      step(1);
    };
    d.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("on")) return;
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        var f = $$("button,a[href]", lb).filter(function (x) {
          return x.offsetParent !== null;
        });
        if (!f.length) return;
        var a = f[0],
          z = f[f.length - 1];
        if (e.shiftKey && d.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && d.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    });
    var sx = 0;
    lb.addEventListener(
      "touchstart",
      function (e) {
        sx = e.touches[0].clientX;
      },
      { passive: true },
    );
    lb.addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
      },
      { passive: true },
    );
  }
})();
