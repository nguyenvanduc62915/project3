function deleteSPCart(userId) {

    fetch(`/remove-mot-sp/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Có thể thêm các tùy chọn khác như body nếu cần
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // alert("click me")
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Thành Công!',
            //     text: data.message,
            //     confirmButtonText: 'OK'
            // })
            // .then(() => {                    
            //     window.location.reload(); // Tải lại trang hiện tại
            // });

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
                "timeOut": "1000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr["success"](data.message, "Thành Công!")
            setTimeout(function() {
                toastr.clear();
                window.location.href = '/get-chi-tiet-cart-url';
                // window.location.reload();
            }, 1000); 
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.',
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });

}