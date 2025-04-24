document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("dathang");
    var loader = document.getElementById("loader");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      loader.style.display = "flex";

      setTimeout(function () {
        loader.style.display = "none";
        // Xử lý dữ liệu
      }, 4000);
    });
  });