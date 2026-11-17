document.querySelectorAll(".seg button").forEach(function (b) {
  b.addEventListener("click", function () {
    try {
      b.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
    } catch (e) {}
  });
});
