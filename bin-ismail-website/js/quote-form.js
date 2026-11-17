(function () {
  var g = document.getElementById("chps"),
    h = document.getElementById("s"),
    e = document.getElementById("serr"),
    ow = document.getElementById("owrap"),
    oi = document.getElementById("o");
  function sync() {
    var v = [];
    [].forEach.call(
      g.querySelectorAll(".chp[aria-checked=true]"),
      function (b) {
        var x = b.dataset.v;
        if (x === "Other") {
          var t = oi.value.trim();
          x = t ? "Other: " + t : "Other";
        }
        v.push(x);
      },
    );
    h.value = v.join(", ");
    var on = !!g.querySelector('.chp[data-v="Other"][aria-checked=true]');
    ow.hidden = !on;
    if (v.length) e.hidden = true;
  }
  g.addEventListener("click", function (ev) {
    var b = ev.target.closest(".chp");
    if (!b) return;
    var on = b.getAttribute("aria-checked") === "true";
    b.setAttribute("aria-checked", on ? "false" : "true");
    sync();
  });
  oi.addEventListener("input", sync);
})();
