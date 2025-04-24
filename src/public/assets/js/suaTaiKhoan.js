function validateForm(id) {    

    var username = document.getElementById('TenDangNhap' + id).value;
    var HoTen = document.getElementById('HoTen' + id).value;
    var password = document.getElementById('MatKhau' + id).value;
    var sdt = document.getElementById('SDT' + id).value;
    var isValid = true;

    // Kiểm tra tên người dùng: không viết hoa, không có dấu, tối thiểu 6 kí tự
    var usernameRegex = /^[a-z0-9]{6,}$/;
    if (!usernameRegex.test(username)) {
        document.getElementById('txt_TenDangNhap' + id).innerHTML = 'Username không hợp lệ. Không được viết hoa và có dấu, tối thiểu 6 kí tự';
        isValid = false;
    } else {
        document.getElementById('txt_TenDangNhap' + id).innerHTML = '';
    }

    //  kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt
    var HoTenRegex = /^[a-zA-ZÀ-ỹ\s']+$/;
    if (!HoTenRegex.test(HoTen)) {
        document.getElementById('txt_HoTen' + id).innerHTML = 'Họ tên không hợp lệ. Kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt và không có số';
        isValid = false;
    } else {
        document.getElementById('txt_HoTen' + id).innerHTML = '';
    }

    // Kiểm tra mật khẩu: Tối thiểu 8 ký tự, ít nhất một chữ cái và một số:
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('txt_MatKhau' + id).innerHTML = 'Password không hợp lệ. Tối thiểu 6 ký tự, ít nhất 1 chữ cái và 1 số và không có kí tự đặc biệt\n ';
        isValid = false;
    } else {
        document.getElementById('txt_MatKhau' + id).innerHTML = '';
    }

    var sdtRegex = /^0\d{9}$/;
    if (!sdtRegex.test(sdt)) {
        document.getElementById('txt_SDT' + id).innerHTML = 'Số điện thoại không hợp lệ, Phải đủ 10 số và bắt đầu bằng số 0 ';
        isValid = false;
    } else {
        document.getElementById('txt_SDT' + id).innerHTML = '';
    }

    return isValid;
}

document.addEventListener('DOMContentLoaded', function() {
    // Lặp qua các form để gán sự kiện submit --- tài khoản admin
    document.querySelectorAll('.updateADKhoa').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

            // Lấy id từ form hiện tại
            const id = form.getAttribute('id').replace('updatelistADWithTime', '');

            // Lấy trạng thái của switchElement từ form hiện tại
            const switchElement = document.querySelector('#moKhoaTK' + id);
            const moKhoaTK = switchElement.checked; // true nếu checked, false nếu không

            console.log("id: ", id);
            console.log("moKhoaTK: ", moKhoaTK);
     

            // Tạo formData để chứa dữ liệu form và file ảnh
            const formData = new FormData();
            formData.append('idEdit', id);
            formData.append('moKhoaTK', moKhoaTK);            

            // Gửi request fetch để cập nhật tài khoản admin
            fetch(`/save-tk-dang-khoa/${id}`, {
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
    
    // update tài khoản admin
    document.querySelectorAll('.updateAd').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

            // Lấy id từ form hiện tại
            const id = form.getAttribute('id').replace('updateAd', '');

            // Kiểm tra hợp lệ của dữ liệu
            if (!validateForm(id)) {
                // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
                return;
            }

            // Lấy các giá trị từ form sử dụng ID của loại sản phẩm
            const TenDangNhap = document.getElementById('TenDangNhap' + id).value;
            const HoTen = document.getElementById('HoTen' + id).value;
            const MatKhau = document.getElementById('MatKhau' + id).value;
            const SDT = document.getElementById('SDT' + id).value;
            

            // Tạo formData để chứa dữ liệu form và file ảnh
            const formData = new FormData();
            formData.append('idEditAd', id);
            formData.append('TenDangNhap', TenDangNhap);
            formData.append('HoTen', HoTen);
            formData.append('MatKhau', MatKhau);
            formData.append('SDT', SDT);
       

            // Gửi request fetch để cập nhật tài khoản admin
            fetch(`/save-tk-admin/${id}`, {
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

});
