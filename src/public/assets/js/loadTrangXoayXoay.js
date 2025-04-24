document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("lammoi");
    var loader = document.getElementById("loader");

    btn.addEventListener("click", function () {
      event.preventDefault();

      loader.style.display = "flex";

      setTimeout(function () {
        loader.style.display = "none";
        window.location.reload();
      }, 1000);
    });
});

