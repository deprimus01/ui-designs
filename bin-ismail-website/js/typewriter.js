(function () {
  var w = document.getElementById("tw"),
    c = w && w.nextElementSibling;
  if (!w) return;
  var W = [
      "wedding cards",
      "business cards",
      "custom shirts",
      "mugs and bottles",
      "awards and plaques",
      "campaign gifts",
    ],
    K = [
      "#0071E3",
      "#EC008C",
      "#00AEEF",
      "#E6A800",
      "#0071E3",
      "#EC008C",
    ];
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  function dk() {
    var t = document.documentElement.getAttribute("data-theme");
    return t
      ? t === "dark"
      : matchMedia("(prefers-color-scheme:dark)").matches;
  }
  function z(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }
  var jump = -1;
  window.__twJump = function (n) {
    jump = n;
  };
  function wt(ms) {
    return new Promise(function (r) {
      var t = 0,
        h = setInterval(function () {
          t += 50;
          if (jump >= 0 || t >= ms) {
            clearInterval(h);
            r();
          }
        }, 50);
    });
  }
  (async function () {
    var i = 0;
    await z(900);
    while (1) {
      if (jump >= 0) {
        i = jump;
        jump = -1;
        var q = W[i],
          cl = K[i] === "#0071E3" && dk() ? "#2997FF" : K[i];
        w.style.color = cl;
        c.style.background = cl;
        w.textContent = q;
        await wt(3500);
        continue;
      }
      var t = W[i],
        col = K[i] === "#0071E3" && dk() ? "#2997FF" : K[i];
      w.style.color = col;
      c.style.background = col;
      for (var k = t.length; k >= 0; k--) {
        if (jump >= 0) break;
        w.textContent = t.slice(0, k);
        await z(35);
      }
      if (jump >= 0) continue;
      await z(250);
      i = (i + 1) % W.length;
      t = W[i];
      col = K[i] === "#0071E3" && dk() ? "#2997FF" : K[i];
      w.style.color = col;
      c.style.background = col;
      for (k = 1; k <= t.length; k++) {
        if (jump >= 0) break;
        w.textContent = t.slice(0, k);
        await z(70);
      }
      if (jump >= 0) continue;
      await wt(1500);
    }
  })();
})();
