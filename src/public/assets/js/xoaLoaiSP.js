function deleteLoaiSP(userId) {
    fetch(`/xoa-loaisp/${userId}`, {
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
            // toastr.options = {
            //     "closeButton": true,
            //     "debug": false,
            //     "newestOnTop": true,
            //     "progressBar": true,
            //     "positionClass": "toast-top-right",
            //     "preventDuplicates": false,
            //     "onclick": null,
            //     "showDuration": "300",
            //     "hideDuration": "1000",
            //     "timeOut": "1500",
            //     "extendedTimeOut": "1000",
            //     "showEasing": "swing",
            //     "hideEasing": "linear",
            //     "showMethod": "fadeIn",
            //     "hideMethod": "fadeOut"
            // }
            // toastr["success"](data.message, "Thành Công!")
            // setTimeout(function() {
            //     toastr.clear();
            //     window.location.reload();
            // }, 1500); 
        } else {
            // Show error alert
            // toastr.error('Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.', 'Lỗi!');
            alert("xoá không thành công")
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}


function deleteHangSX(tenCanXoa) {
    fetch(`/xoa-hang-sx/${tenCanXoa}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        // Có thể thêm các tùy chọn khác như body nếu cần
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Thành Công!',
                text: data.message,
                confirmButtonText: 'OK'
            })
            .then(() => {                    
                // window.location.href = '/home-the-loai-nsx';
                window.location.reload();
            });            
        } else {
            // Show error alert
            // toastr.error('Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.', 'Lỗi!');
            alert("xoá không thành công")
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}