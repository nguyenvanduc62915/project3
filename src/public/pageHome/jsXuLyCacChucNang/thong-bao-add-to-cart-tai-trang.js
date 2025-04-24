document.getElementById("form-addtocart").addEventListener("submit", function(event) {
    // Ngăn chặn việc gửi form mặc định
    event.preventDefault();
    
    // Lấy giá trị của trường input idVaoDay
    var idVaoDayValue = document.getElementById("idVaoDay").value;
    
    // Tạo đối tượng FormData từ form
    var formData = new FormData(this);
    
    // Thêm giá trị idVaoDay vào formData
    formData.append("idVaoDay", idVaoDayValue);
    
    // Gửi yêu cầu fetch
    fetch(`/add-to-cart?productId=${idVaoDayValue}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success ) {
            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: data.message,
                confirmButtonText: 'Mua Tiếp'
            })
            .then(() => {
                window.location.reload(); // Tải lại trang
            });
        } else {
            // Hiển thị thông báo lỗi
            Swal.fire({
                icon: 'error',
                title: 'Hết hàng!',
                text: data.message,
                confirmButtonText: 'OK SHOP'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
