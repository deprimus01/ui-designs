(function () {
  var el = document.getElementById("hero-particles");
  if (!el || !window.tsParticles) return;
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches,
    cont = null,
    busy = false,
    again = false;
  function dk() {
    var t = document.documentElement.getAttribute("data-theme");
    return t
      ? t === "dark"
      : matchMedia("(prefers-color-scheme:dark)").matches;
  }
  function opts() {
    var d = dk(),
      w = innerWidth,
      n = w < 700 ? 20 : w < 1100 ? 34 : 46;
    var cols = d
      ? ["#2997FF", "#2997FF", "#00D4FF", "#00BFFF", "#3D8BFF", "#00D4FF"]
      : [
          "#0071E3",
          "#0071E3",
          "#00AEEF",
          "#00AEEF",
          "#4DA3FF",
          "#0071E3",
          "#00AEEF",
          "#4DA3FF",
          "#EC008C",
          "#FFD500",
        ];
    return {
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 40,
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        number: { value: n, density: { enable: false } },
        color: { value: cols },
        shape: { type: "circle" },
        links: { enable: false },
        opacity: {
          value: { min: 0.12, max: d ? 0.5 : 0.42 },
          animation: {
            enable: !rm,
            speed: 0.35,
            sync: false,
            startValue: "random",
          },
        },
        size: { value: { min: 1.4, max: d ? 3.2 : 4 } },
        move: {
          enable: !rm,
          speed: { min: 0.12, max: 0.38 },
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
    };
  }
  async function go() {
    if (busy) {
      again = true;
      return;
    }
    busy = true;
    try {
      if (cont) {
        cont.destroy();
        cont = null;
      }
      cont = await tsParticles.load({
        id: "hero-particles",
        options: opts(),
      });
    } catch (e) {}
    busy = false;
    if (again) {
      again = false;
      go();
    }
  }
  (async function () {
    try {
      if (window.loadSlim) await loadSlim(tsParticles);
    } catch (e) {}
    go();
  })();
  new MutationObserver(go).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  try {
    matchMedia("(prefers-color-scheme:dark)").addEventListener(
      "change",
      go,
    );
  } catch (e) {}
})();
