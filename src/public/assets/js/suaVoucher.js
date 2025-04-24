
function validateFormVoucher_edit(id) {
    var MaGiamGia = document.getElementById('MaGiamGia'+ id).value;
    var GiamGiaTheoDonHang = document.getElementById('GiamGiaTheoDonHang'+ id).value;
    var isValid = true;

    var MaGiamGiaRegex = /^[A-Za-z0-9]+$/;

    if (!MaGiamGiaRegex.test(MaGiamGia)) {
        document.getElementById('txt_MaGiamGia'+ id).innerHTML = 'Mã giảm giá không hợp lệ. Không được viết có dấu!';
        isValid = false;
    } else {
        document.getElementById('txt_MaGiamGia'+ id).innerHTML = '';
    }

    var GiamGiaTheoDonHangRegex = /^[0-9]+$/;
    if (!GiamGiaTheoDonHangRegex.test(GiamGiaTheoDonHang)) {
        document.getElementById('txt_GiamGiaTheoDonHang'+ id).innerHTML = 'Không được viết kí tự và không phải là số thập phân!';
        isValid = false;
    } else {
        document.getElementById('txt_GiamGiaTheoDonHang'+ id).innerHTML = '';
    }   

    return isValid;
}

document.addEventListener('DOMContentLoaded', function() {    
    // update voucher
    document.querySelectorAll('.updateVoucher').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

            // Lấy id từ form hiện tại
            const id = form.getAttribute('id').replace('updateVoucher', '');

            // Kiểm tra hợp lệ của dữ liệu
            if (!validateFormVoucher_edit(id)) {
                // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới voucher
                return;
            }

            // Lấy các giá trị từ form sử dụng ID của loại sản phẩm
            const MaGiamGia = document.getElementById('MaGiamGia' + id).value;
            const GiamGiaTheoDonHang = document.getElementById('GiamGiaTheoDonHang' + id).value;
            const DieuKienGiamGia = document.getElementById('DieuKienGiamGia' + id).value;
            

            // Tạo formData để chứa dữ liệu form và file ảnh
            const formData = new FormData();
            formData.append('idEditVoucher', id);
            formData.append('MaGiamGia', MaGiamGia);
            formData.append('GiamGiaTheoDonHang', GiamGiaTheoDonHang);
            formData.append('DieuKienGiamGia', DieuKienGiamGia);
       

            // Gửi request fetch để cập nhật tài khoản admin
            fetch(`/save-voucher/${id}`, {
                method: 'PUT',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if(data.check){
                        Swal.fire({
                            icon: 'question',
                            text: data.message,
                            confirmButtonText: 'OK Cậu'
                        })
                        .then(() => {
                            // window.location.href = '/home-the-loai-nsx';
                            // window.location.reload();
                        });
                    } else {
                        // Hiển thị thông báo thành công
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành Công!',
                            text: data.message,
                            confirmButtonText: 'OK Cậu'
                        })
                        .then(() => {
                            // window.location.href = '/home-the-loai-nsx';
                            window.location.reload();
                        });
                    }  
                    // window.location.reload();                  
                } else {
                    // Hiển thị thông báo lỗi
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: data.message,
                        confirmButtonText: 'OK SHOP'
                    });                       
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });
    }); 


    // update đơn hàng
    document.querySelectorAll('.updateDonHangChuaGiao, .updateDonHangDangGiao, .updateDonHangDaGiao').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định
    
            // Lấy id từ form hiện tại
            const id = form.getAttribute('id').replace(/updateDonHang(ChuaGiao|DangGiao|DaGiao)/, '');
            
            // Lấy giá trị từ radio button
            const TinhTrangDonHang = document.getElementById(`TinhTrangDonHang1-${id}`).checked ? document.getElementById(`TinhTrangDonHang1-${id}`).value :
            document.getElementById(`TinhTrangDonHang2-${id}`).checked ? document.getElementById(`TinhTrangDonHang2-${id}`).value :
            document.getElementById(`TinhTrangDonHang3-${id}`).checked ? document.getElementById(`TinhTrangDonHang3-${id}`).value : null;

            const TinhTrangThanhToan = document.getElementById(`TinhTrangThanhToan1-${id}`).checked ? document.getElementById(`TinhTrangThanhToan1-${id}`).value :
            document.getElementById(`TinhTrangThanhToan2-${id}`).checked ? document.getElementById(`TinhTrangThanhToan2-${id}`).value : null;

            
    
            // Log để kiểm tra
            console.log("id: ", id);
            console.log("TinhTrangDonHang: ", TinhTrangDonHang);
            console.log("TinhTrangThanhToan: ", TinhTrangThanhToan);

    
            // Kiểm tra giá trị trước khi tiếp tục
            if (TinhTrangDonHang === null || TinhTrangThanhToan === null) {
                alert("Vui lòng chọn tình trạng đơn hàng và tình trạng thanh toán.");
                return;
            }

            
    
            // Tiến hành xử lý tiếp theo
            const formData = new FormData();
            formData.append('idEditDHDangGiao', id);
            formData.append('idEditDHChuaGiao', id);
            formData.append('TinhTrangDonHang', TinhTrangDonHang);
            formData.append('TinhTrangThanhToan', TinhTrangThanhToan);
       

            // Gửi request fetch để cập nhật tài khoản admin
            fetch(`/save-don-hang/${id}`, {
                method: 'PUT',
                body: formData
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
                        window.location.href = '/list-don-hang';
                    });
                } else {                
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi chỉnh sửa. Vui lòng thử lại sau.',
                        confirmButtonText: 'OK SHOP'
                    });                       
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });
    });
    
});
