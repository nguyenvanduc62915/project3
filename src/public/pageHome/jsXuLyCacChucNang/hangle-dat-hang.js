document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("dathang");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const formData = new FormData(form);

        // Make an AJAX request
        fetch("/dat-hang", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {

                if(data.paymentMethodSelected == 'online') {
                    console.log("Payment URL: ", data.paymentUrl); // Kiểm tra URL thanh toán
                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": true,
                        "progressBar": true,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "2000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    }
                    toastr["success"](data.message, "Thành Công!")
                    window.open(data.paymentUrl, '_blank');
                    setTimeout(function() {
                        toastr.clear();
                        window.location.href = "/get-chi-tiet-cart-url";
                    }, 2000);
                } else {
                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": true,
                        "progressBar": true,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "2000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    }
                    toastr["success"](data.message, "Thành Công!")
                    setTimeout(function() {
                        toastr.clear();
                        window.location.href = "/get-chi-tiet-cart-url";
                    }, 2000);
                }

            } else {
                if (data.error) {                                

                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": true,
                        "progressBar": true,
                        "positionClass": "toast-top-full-width",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    }
                    toastr["error"](data.error, "Đặt hàng thất bại")

                } else if (data.message) {

                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": true,
                        "progressBar": true,
                        "positionClass": "toast-top-full-width",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    }
                    toastr["error"](data.message, "Đặt hàng thất bại")
                } else {

                    toastr.options = {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": true,
                        "progressBar": true,
                        "positionClass": "toast-top-full-width",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    }
                    toastr["error"]('Có vẻ có một số sản phẩm đã hết hàng. Vui lòng kiểm tra lại giỏ hàng của bạn.', "Đặt hàng thất bại")
                }
            }
        })
        .catch((error) => {
            console.error("Error in dat-hang:", error);
        });
    });
});