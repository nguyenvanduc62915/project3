document.getElementById("add-voucher").addEventListener("submit", function(event) {
    // Ngăn chặn việc gửi form mặc định
    event.preventDefault();        
    
    var formData = new FormData(this);
    var queryString = new URLSearchParams(formData).toString();

    fetch(`/add-voucher`, {
        method: 'POST',
        body: queryString,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success ) {
            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: data.message,
                confirmButtonText: 'Cảm Ơn Shop'
            })
            .then(() => {
                window.location.reload(); // Tải lại trang
            });
        } else {
            // Hiển thị thông báo lỗi
            Swal.fire({
                icon: 'error',
                title: 'Đơn hàng không đủ điều kiện!',
                text: data.message,
                confirmButtonText: 'Cảm Ơn Shop'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
