function updateSPTrongCart(id, idInp) {

    console.log("idInp: ", idInp);
    // Sử dụng idInp để lấy giá trị chính xác từ các trường nhập liệu
    let donGiaProduct = document.getElementById("price-product" + idInp).value;
    let giaChuaGiam = document.getElementById("old-price-input" + idInp).value;
    const SoLuongMua = document.getElementById("SoLuongMua" + idInp).value;
    const sizeSelect = document.getElementById('size-select' + idInp);
    const size = sizeSelect.options[sizeSelect.selectedIndex].text;

    // Loại bỏ ký hiệu tiền tệ và dấu phân cách để chuyển đổi thành số nguyên
    donGiaProduct = parseInt(donGiaProduct.replace(/\D/g, ''));
    giaChuaGiam = parseInt(giaChuaGiam.replace(/\D/g, ''));

    console.log("donGiaProduct: ", donGiaProduct);
    console.log("giaChuaGiam: ", giaChuaGiam);
    console.log("SoLuongMua: ", SoLuongMua);
    console.log("size: ", size);


    // Dữ liệu cập nhật
    const updateData = {
        donGiaProduct: donGiaProduct,
        giaChuaGiam: giaChuaGiam,
        SoLuongMua: SoLuongMua,
        size: size
    };

    fetch(`/update-mot-sp-cart/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success alert
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Thành Công!',
            //     text: data.message,
            //     confirmButtonText: 'OK'
            // })
            // .then(() => {                    
            //     window.location.href = '/get-chi-tiet-cart-url';
            // });

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-left",
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
                title: 'Hết hàng!',
                text: data.message,
                confirmButtonText: 'OK SHOP'
            })
            // .then(() => {                    
            //     location.reload(); // Làm mới trang
            // });                    
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}