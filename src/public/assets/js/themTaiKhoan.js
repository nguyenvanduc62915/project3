function validateForm_create() {
    var username = document.getElementById('TenDangNhap').value;
    var HoTen = document.getElementById('HoTen').value;
    var password = document.getElementById('MatKhau').value;
    var sdt = document.getElementById('SDT').value;
    var isValid = true;

    // Kiểm tra tên người dùng: không viết hoa, không có dấu, tối thiểu 6 kí tự
    var usernameRegex = /^[a-z0-9]{6,}$/;
    if (!usernameRegex.test(username)) {
        document.getElementById('txt_TenDangNhap').innerHTML = 'Username không hợp lệ. Không được viết hoa và có dấu, tối thiểu 6 kí tự';
        isValid = false;
    } else {
        document.getElementById('txt_TenDangNhap').innerHTML = '';
    }

    //  kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt
    var HoTenRegex = /^[a-zA-ZÀ-ỹ\s']+$/;
    if (!HoTenRegex.test(HoTen)) {
        document.getElementById('txt_HoTen').innerHTML = 'Họ tên không hợp lệ. Kiểm tra họ và tên có dấu và không chứa ký tự đặc biệt và không có số';
        isValid = false;
    } else {
        document.getElementById('txt_HoTen').innerHTML = '';
    }

    // Kiểm tra mật khẩu: Tối thiểu 8 ký tự, ít nhất một chữ cái và một số:
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('txt_MatKhau').innerHTML = 'Password không hợp lệ. Tối thiểu 6 ký tự, ít nhất 1 chữ cái và 1 số\n ';
        isValid = false;
    } else {
        document.getElementById('txt_MatKhau').innerHTML = '';
    }

    var sdtRegex = /^0\d{9}$/;
    if (!sdtRegex.test(sdt)) {
        document.getElementById('txt_SDT').innerHTML = 'Số điện thoại không hợp lệ, Phải đủ 10 số và bắt đầu bằng số 0 ';
        isValid = false;
    } else {
        document.getElementById('txt_SDT').innerHTML = '';
    }

    return isValid;
}

// nút tạo tài khoản admin
function createAdmin() {
    // Kiểm tra hợp lệ của dữ liệu
    if (!validateForm_create()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }

    // Lấy các giá trị từ form
    const TenDangNhap = document.getElementById('TenDangNhap').value;
    const HoTen = document.getElementById('HoTen').value;
    const MatKhau = document.getElementById('MatKhau').value;
    const SDT = document.getElementById('SDT').value;

    console.log("TenDangNhap:",TenDangNhap);
    console.log("HoTen:",HoTen);
    console.log("MatKhau:",MatKhau);
    console.log("SDT:",SDT);
    // Dữ liệu cập nhật
    const createData = {
        TenDangNhap: TenDangNhap,
        HoTen: HoTen,
        MatKhau: MatKhau,
        SDT: SDT,
    };

    fetch(`/create-tk-admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
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
            //     // window.location.href = '/list-account-admin';
            // });
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

// nút thêm tài khoản admin khi phân quyền
let chucNangIds = [];
function createAdminPhanQuyen() {

    const button = event.target; // Lấy thẻ button mà đã kích hoạt hàm
    const modal = button.closest('.modal'); // Tìm modal gần nhất chứa button này
    const id = modal.getAttribute('id').replace('phanQuyenAdmin', ''); // Lấy id từ modal
    console.log(id);
    // Lấy các giá trị từ form
    const IdDangNhap = document.getElementById('IdDangNhap' + id).value;
    const ChucNang = document.querySelectorAll('input[name="ChucNang"]:checked');
    const GhiChu = document.getElementById('GhiChu'+ id).value;
    
    ChucNang.forEach((checkbox) => {
        chucNangIds.push(checkbox.value);
    });

    console.log("IdDangNhap: ", IdDangNhap);
    console.log("chucNangIds: ", chucNangIds);
    console.log("GhiChu: ", GhiChu);

    // // Dữ liệu cập nhật
    const createData = {
        IdDangNhap: IdDangNhap,
        ChucNang: chucNangIds,
        GhiChu: GhiChu
    };

    fetch(`/create-admin-phan-quyen`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
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
                window.location.href = '/list-account-admin';
            });
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


// nút thêm voucher cho kh
let idVoucherKH = [];
function createVoucherKH() {

    const button = event.target; // Lấy thẻ button mà đã kích hoạt hàm
    const modal = button.closest('.modal'); // Tìm modal gần nhất chứa button này
    const id = modal.getAttribute('id').replace('suaVoucher', ''); // Lấy id từ modal
    console.log(id);
    // Lấy các giá trị từ form
    const IdVoucher = document.getElementById('IdVoucher' + id).value;
    const IdMaGiamGiaChoKH = document.querySelectorAll('input[name="IdMaGiamGiaChoKH"]:checked');
    
    IdMaGiamGiaChoKH.forEach((checkbox) => {
        idVoucherKH.push(checkbox.value);
    });

    console.log("IdVoucher: ", IdVoucher);
    console.log("idVoucherKH: ", idVoucherKH);

    // // Dữ liệu cập nhật
    const createData = {
        IdVoucher: IdVoucher,
        IdMaGiamGiaChoKH: idVoucherKH,
    };

    fetch(`/create-voucher-chokh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
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
                window.location.href = '/list-voucher';
            });
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