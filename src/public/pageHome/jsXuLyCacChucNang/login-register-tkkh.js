function validateFormRegister() {
    var Ho = document.getElementById('Ho').value;
    var Ten = document.getElementById('Ten').value;
    var EmailDky = document.getElementById('EmailDky').value;
    var PasswordDky = document.getElementById('PasswordDky').value;
    var NhapLaiPasswordDky = document.getElementById('NhapLaiPasswordDky').value;
    var isValid = true;

    
    var emailDky = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    
    if (!emailDky.test(EmailDky)) {
        document.getElementById('txt_TenDangKy').innerHTML = 'Email không hợp lệ! Có thể định dạng theo: abc@gmail.com \n Hãy nhập đúng email để dễ dàng lấy lại mật khẩu khi bạn quên!';
        isValid = false;
    } else {
        document.getElementById('txt_TenDangKy').innerHTML = '';
    }
    
    var HoRegex = /^[a-zA-ZÀ-ỹ\s']+$/;
    if (!HoRegex.test(Ho)) {
        document.getElementById('txt_Ho').innerHTML = 'Họ tên không hợp lệ. Kiểm tra họ và tên không được có dấu, không chứa ký tự đặc biệt và không có số';
        isValid = false;
    } else {
        document.getElementById('txt_Ho').innerHTML = '';
    }

    var TenRegex = /^[a-zA-ZÀ-ỹ\s']+$/;
    if (!TenRegex.test(Ten)) {
        document.getElementById('txt_Ten').innerHTML = 'Họ tên không hợp lệ. Kiểm tra họ và tên không được có dấu, không chứa ký tự đặc biệt và không có số';
        isValid = false;
    } else {
        document.getElementById('txt_Ten').innerHTML = '';
    }

    // Kiểm tra mật khẩu: Tối thiểu 6 ký tự, ít nhất một chữ cái và một số:
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(PasswordDky)) {
        document.getElementById('txt_MatKhauDky').innerHTML = 'Password không hợp lệ. Tối thiểu 6 ký tự, ít nhất 1 chữ cái và 1 số\n ';
        isValid = false;
    } else {
        document.getElementById('txt_MatKhauDky').innerHTML = '';
    }

    if (PasswordDky != NhapLaiPasswordDky) {
        document.getElementById('txt_NhapLaiMatKhauDky').innerHTML = 'Nhập lại mật khẩu không khớp. Vui lòng thử lại! ';
        isValid = false;
    } else {
        document.getElementById('txt_NhapLaiMatKhauDky').innerHTML = '';
    }

    return isValid;
}


// đăng ký tài khoản khách hàng
const registerform = document.getElementById('register-form');
registerform.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateFormRegister()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }

    const formData = new FormData(registerform);
    const response = await fetch('/register-user', {
        method: 'POST',
        body: formData
    });

    const responseData = await response.json();   

    if(responseData.success) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "5000",
            "timeOut": "5000",
            "extendedTimeOut": "5000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["success"](responseData.message, "Thành Công!")
        setTimeout(function() {
            toastr.clear();
            // window.location.href = '/login-register';
            window.location.reload();
        }, 5000);      
        
    } else {
        // Reset form after 3 seconds
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["error"](responseData.message, "Đăng ký thất bại rồi!")       
        setTimeout(function() {
            toastr.clear();
            registerform.reset(); // Reset form fields 
        }, 5000);                                             
        
    }        
});


function validateFormLogin() {    
    var Email = document.getElementById('Email').value;
    var MatKhau = document.getElementById('MatKhau').value;
    var isValid = true;
    
    var emailLogin = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    
    if (!emailLogin.test(Email)) {
        document.getElementById('txt_TenDangNhap').innerHTML = 'Email không hợp lệ! Có thể định dạng theo: abc@gmail.com \n Hãy nhập đúng email để dễ dàng lấy lại mật khẩu khi bạn quên!';
        isValid = false;
    } else {
        document.getElementById('txt_TenDangNhap').innerHTML = '';
    }
        

    // Kiểm tra mật khẩu: Tối thiểu 6 ký tự, ít nhất một chữ cái và một số:
    // var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    // if (!passwordRegex.test(MatKhau)) {
    //     document.getElementById('txt_MatKhau').innerHTML = 'Password không hợp lệ. Tối thiểu 6 ký tự, ít nhất 1 chữ cái và 1 số\n ';
    //     isValid = false;
    // } else {
    //     document.getElementById('txt_MatKhau').innerHTML = '';
    // }
    

    return isValid;
}

// đăng nhập tài khoản khách hàng
const loginform = document.getElementById('login-form');
loginform.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateFormLogin()) {
        // Nếu dữ liệu không hợp lệ, không thực hiện tạo mới tài khoản admin
        return;
    }

    const formData = new FormData(loginform);
    const username = formData.get('Email');
    const password = formData.get('MatKhau');
    const rememberMe = document.getElementById('remember_me').checked;

    // Kiểm tra xem có nên lưu thông tin đăng nhập hay không
    if (rememberMe) {
        // Lưu thông tin đăng nhập vào Local Storage
        localStorage.setItem('Email', username);
        localStorage.setItem('MatKhau', password);
        localStorage.setItem('remember_me', true);
    } else {
        // Xóa thông tin đăng nhập khỏi Local Storage nếu người dùng không muốn ghi nhớ
        localStorage.removeItem('Email');
        localStorage.removeItem('MatKhau');
        localStorage.removeItem('remember_me');
    }

    const response = await fetch('/login-user', {
        method: 'POST',
        body: formData
    });

    const responseData = await response.json();   

    if(responseData.success) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1500",
            "timeOut": "1500",
            "extendedTimeOut": "1500",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["success"](responseData.message, "Thành Công!")
        setTimeout(function() {
            toastr.clear();
            // window.location.href = '/login-register';
            window.location.reload();
        }, 1500);      
        
    } else {
        // Reset form after 3 seconds
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["error"](responseData.message, "Đăng nhập thất bại rồi!")       
        setTimeout(function() {
            toastr.clear();
            loginform.reset(); // Reset form fields 
        }, 5000);                                             
        
    }        
});

// Kiểm tra xem có thông tin đăng nhập đã được lưu trong Local Storage hay không
// lưu lại tài khoản khi người dùng cần lưu
document.addEventListener('DOMContentLoaded', function () {
    const storedUsername = localStorage.getItem('Email');
    const storedPassword = localStorage.getItem('MatKhau');
    const storedRememberMe = localStorage.getItem('remember_me');

    console.log("storedUsername", storedUsername);
    if (storedUsername && storedPassword && storedRememberMe) {
        // Điền thông tin đăng nhập vào form
        document.getElementById('Email').value = storedUsername;
        document.getElementById('MatKhau').value = storedPassword;
        document.getElementById('remember_me').checked = true;
    }
});


// ---------------------------------------------------

// lấy lại mật khẩu
const doimk = document.getElementById('doi-mk');
doimk.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(doimk);
    const response = await fetch('/quen-mat-khau', {
        method: 'POST',
        body: formData
    });

    const responseData = await response.json();

    if(responseData.success) {

        $('#quenMKModalToggle').modal('hide');

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
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["success"](responseData.message, "Thành Công!")
        // Xóa giá trị trong input email
        $('input[name="email_doimk"]').val('');
        // setTimeout(function() {
        //     toastr.clear();
        //     window.location.reload()
        // }, 2000);

    } else {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr["error"](responseData.message, "Xem lại Email của bạn!")

    }        
});

// xoay xoay loader khi quên mật khẩu
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("doi-mk");
    var loader = document.getElementById("loader");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      loader.style.display = "flex";

      setTimeout(function () {
        loader.style.display = "none";
        // Xử lý dữ liệu
      }, 3500);
    });
  });

