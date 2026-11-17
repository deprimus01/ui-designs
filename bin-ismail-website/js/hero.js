(function () {
  var d = document,
    hs = d.getElementById("hs");
  if (!hs) return;
  var pk = [].slice.call(hs.querySelectorAll(".pk")),
    tw = d.getElementById("tw"),
    W = [
      "wedding cards",
      "business cards",
      "custom shirts",
      "mugs and bottles",
      "awards and plaques",
    ];
  function act() {
    var i = W.indexOf(tw ? tw.textContent : "");
    pk.forEach(function (e, k) {
      e.classList.toggle("on", k === i);
    });
  }
  if (tw) {
    act();
    new MutationObserver(act).observe(tw, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  pk.forEach(function (e, k) {
    e.tabIndex = 0;
    e.setAttribute("role", "button");
    function go() {
      if (window.__twJump) window.__twJump(k);
      else
        pk.forEach(function (x) {
          x.classList.remove("on");
        });
      e.classList.remove("hit");
      void e.offsetWidth;
      e.classList.add("on", "hit");
      clearTimeout(e._h);
      e._h = setTimeout(function () {
        e.classList.remove("hit");
      }, 950);
    }
    e.addEventListener("click", go);
    e.addEventListener("keydown", function (v) {
      if (v.key === "Enter" || v.key === " ") {
        v.preventDefault();
        go();
      }
    });
  });
  if (
    matchMedia("(hover:hover) and (pointer:fine)").matches &&
    !matchMedia("(prefers-reduced-motion:reduce)").matches &&
    !d.documentElement.classList.contains("fx-lite")
  ) {
    var raf;
    hs.addEventListener("pointermove", function (e) {
      var r = hs.getBoundingClientRect(),
        x = ((e.clientX - r.left) / r.width - 0.5) * 2,
        y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        pk.forEach(function (c) {
          c.style.setProperty("--px", x.toFixed(2));
          c.style.setProperty("--py", y.toFixed(2));
        });
      });
    });
    hs.addEventListener("pointerleave", function () {
      cancelAnimationFrame(raf);
      pk.forEach(function (c) {
        c.style.setProperty("--px", 0);
        c.style.setProperty("--py", 0);
      });
    });
  }
  if ("IntersectionObserver" in window)
    new IntersectionObserver(function (e) {
      hs.classList.toggle("fx-paused", !e[0].isIntersecting);
    }).observe(hs);
})();
