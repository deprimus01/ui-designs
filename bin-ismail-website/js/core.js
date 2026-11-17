var d = document,
  r = d.documentElement,
  $ = function (s) {
    return d.querySelector(s);
  },
  $$ = function (s) {
    return [].slice.call(d.querySelectorAll(s));
  };
function dark() {
  var t = r.dataset.theme;
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
}
function icon() {
  $("#theme").innerHTML =
    '<i class="fa-solid fa-' +
    (dark() ? "sun" : "moon") +
    '" aria-hidden="true"></i>';
}
icon();
$("#theme").onclick = function () {
  var t = dark() ? "light" : "dark";
  r.dataset.theme = t;
  try {
    localStorage.setItem("theme", t);
  } catch (e) {}
  icon();
};
var m = $("#menu"),
  l = $("#links"),
  sc = $("#scrim");
function setMenu(o) {
  l.classList.toggle("open", o);
  sc.classList.toggle("on", o);
  m.setAttribute("aria-expanded", o);
  m.innerHTML =
    '<i class="fa-solid fa-' +
    (o ? "xmark" : "bars") +
    '" aria-hidden="true"></i>';
}
m.onclick = function () {
  setMenu(!l.classList.contains("open"));
};
sc.onclick = function () {
  setMenu(false);
};
d.addEventListener("keydown", function (e) {
  if (e.key === "Escape") setMenu(false);
});
$$("#links a").forEach(function (a) {
  a.onclick = function () {
    setMenu(false);
  };
});
function filt(seg, f) {
  $$('[data-target="' + seg + '"] button').forEach(function (b) {
    b.classList.toggle("on", b.dataset.f === f);
  });
  $$(seg === "work" ? "#grid .p" : "#rows .row").forEach(function (c) {
    c.hidden = !(f === "all" || c.dataset.c.split(" ").indexOf(f) > -1);
  });
}
$$(".seg button").forEach(function (b) {
  b.onclick = function () {
    filt(b.parentNode.dataset.target, b.dataset.f);
  };
});
$$(".cats a[data-f]").forEach(function (a) {
  a.onclick = function () {
    filt("work", a.dataset.f);
  };
});
var demo = $("#demo"),
  tm,
  pn = 0;
function play() {
  demo.classList.remove("tapped");
  clearTimeout(tm);
  setTimeout(function () {
    demo.classList.add("tapped");
  }, 700);
  pn++;
  if (pn < 3) tm = setTimeout(play, 8000);
}
$("#replay").onclick = function () {
  pn = 0;
  play();
};
if ("IntersectionObserver" in window) {
  new IntersectionObserver(
    function (e, o) {
      if (e[0].isIntersecting) {
        play();
        o.disconnect();
      }
    },
    { threshold: 0.4 },
  ).observe(demo);
} else {
  play();
}
$("#y").textContent = new Date().getFullYear();
$("#qf").onsubmit = function (e) {
  e.preventDefault();
  if (!$("#s").value) {
    var er = $("#serr");
    er.hidden = false;
    try {
      $("#chps").scrollIntoView({ block: "center", behavior: "smooth" });
    } catch (x) {}
    var f = $("#chps .chp");
    if (f) f.focus();
    return;
  }
  var g = function (i) {
    return $("#" + i).value.trim();
  };
  var t =
    "Hello Bin Ismail General Printing and Press,\n\nMy name is " +
    g("n") +
    ".\nI want: " +
    g("s") +
    ".\n";
  if (g("q")) t += "Quantity: " + g("q") + ".\n";
  if (g("d")) t += "Details: " + g("d") + ".\n";
  t += "\nPlease send me the price. Thank you.";
  window.open(
    "https://wa.me/2349121384977?text=" + encodeURIComponent(t),
    "_blank",
  );
};
