function validateForm_create() {
    var MaGiamGia = document.getElementById('MaGiamGia').value;
    var GiamGiaTheoDonHang = document.getElementById('GiamGiaTheoDonHang').value;
    var DieuKienGiamGia = document.getElementById('DieuKienGiamGia').value;
    var isValid = true;

    var MaGiamGiaRegex = /^[A-Za-z0-9]+$/;

    if (!MaGiamGiaRegex.test(MaGiamGia)) {
        document.getElementById('txt_MaGiamGia').innerHTML = 'Mã giảm giá không hợp lệ. Không được viết có dấu!';
        isValid = false;
    } else {
        document.getElementById('txt_MaGiamGia').innerHTML = '';
    }

    var GiamGiaTheoDonHangRegex = /^[0-9]+$/;
    if (!GiamGiaTheoDonHangRegex.test(GiamGiaTheoDonHang)) {
        document.getElementById('txt_GiamGiaTheoDonHang').innerHTML = 'Không được viết kí tự và không phải là số thập phân!';
        isValid = false;
    } else {
        document.getElementById('txt_GiamGiaTheoDonHang').innerHTML = '';
    }   

    return isValid;
}


function createVoucher() {
    // Kiểm tra hợp lệ của dữ liệu
    if (!validateForm_create()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }

    // Lấy các giá trị từ form
    const MaGiamGia = document.getElementById('MaGiamGia').value;
    const GiamGiaTheoDonHang = document.getElementById('GiamGiaTheoDonHang').value;
    const DieuKienGiamGia = document.getElementById('DieuKienGiamGia').value;

    // Dữ liệu cập nhật
    const createData = {
        MaGiamGia: MaGiamGia,
        GiamGiaTheoDonHang: GiamGiaTheoDonHang,
        DieuKienGiamGia: DieuKienGiamGia,
    };

    fetch(`/create-voucher`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {        
            window.location.reload();
        } else {                
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
}

function loadTrang() {
    window.location.reload();
}