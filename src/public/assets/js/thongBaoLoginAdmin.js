// phan dang nhap tai khoan admin
const loginform = document.getElementById('signin-form');
const tbLoginThanhCong = document.getElementById('tbLoginThanhCong');
const mess_tb_success = document.getElementById('mess_tb_success');
const tbLoginThatBai = document.getElementById('tbLoginThatBai');
const mess_tb_danger = document.getElementById('mess_tb_danger');

loginform.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(loginform);
    const username = formData.get('TenDangNhap');
    const password = formData.get('MatKhau');
    const rememberMe = document.getElementById('rememberMe').checked;

    // Kiểm tra xem có nên lưu thông tin đăng nhập hay không
    if (rememberMe) {
        // Lưu thông tin đăng nhập vào Local Storage
        localStorage.setItem('TenDangNhap', username);
        localStorage.setItem('MatKhau', password);
        localStorage.setItem('rememberMe', true);
    } else {
        // Xóa thông tin đăng nhập khỏi Local Storage nếu người dùng không muốn ghi nhớ
        localStorage.removeItem('TenDangNhap');
        localStorage.removeItem('MatKhau');
        localStorage.removeItem('rememberMe');
    }

    const response = await fetch('/login-admin', {
        method: 'POST',
        body: formData
    });

    const responseData = await response.json();   

    if(responseData.success) {
        
        // Hiển thị thông báo thành công
        tbLoginThanhCong.style.display = 'block';
        mess_tb_success.innerHTML = responseData.message
        
        // Chuyển hướng sau 1 giây
        setTimeout(function() {
            window.location.href = '/home-admin';
        }, 2000);     
        
    } else {
        tbLoginThatBai.style.display = 'block';
        mess_tb_danger.innerHTML = responseData.message
        setTimeout(function() {            
            loginform.reset(); // Reset form fields 
            tbLoginThatBai.style.display = 'none';
        }, 5000);                                             
        
    }        
});

// Kiểm tra xem có thông tin đăng nhập đã được lưu trong Local Storage hay không
// lưu lại tài khoản khi người dùng cần lưu
document.addEventListener('DOMContentLoaded', function () {
    const storedUsername = localStorage.getItem('TenDangNhap');
    const storedPassword = localStorage.getItem('MatKhau');
    const storedRememberMe = localStorage.getItem('rememberMe');

    console.log("storedUsername", storedUsername);
    if (storedUsername && storedPassword && storedRememberMe) {
        // Điền thông tin đăng nhập vào form
        document.getElementById('TenDangNhap').value = storedUsername;
        document.getElementById('MatKhau').value = storedPassword;
        document.getElementById('rememberMe').checked = true;
    }
});