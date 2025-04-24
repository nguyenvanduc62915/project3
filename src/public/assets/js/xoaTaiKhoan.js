function deleteAdmin(userId) {

    fetch(`/delete-tk-admin/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        // Có thể thêm các tùy chọn khác như body nếu cần
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
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

// xóa voucher
function deleteVoucher(userId) {

    fetch(`/delete-voucher/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        // Có thể thêm các tùy chọn khác như body nếu cần
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: data.error,
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// xóa tài khoản khách hàng
function deleteTKKH(userId) {

    fetch(`/delete-tkkh/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        // Có thể thêm các tùy chọn khác như body nếu cần
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {                
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: data.error,
                confirmButtonText: 'OK SHOP'
            });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// xoá phiên admin
function deleteTokenAD(userId) {

    fetch(`/delete-token-admin/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        // Có thể thêm các tùy chọn khác như body nếu cần
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
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

// cách 1 dùng params
function deleteDonHang(userId) {
    console.log("userId >>>",userId);
    // if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
        fetch(`/delete-HoaDon/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // Có thể thêm các tùy chọn khác như body nếu cần
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Thành Công!',
                    text: data.message,
                    confirmButtonText: 'OK'
                })
                .then(() => {                    
                    window.location.reload(); // Tải lại trang hiện tại
                });
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
    // }
}

