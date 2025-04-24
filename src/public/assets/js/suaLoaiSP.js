document.addEventListener('DOMContentLoaded', function() {
    // Lặp qua các form để gán sự kiện submit --- loại sản phẩm
    document.querySelectorAll('.updateLoaiSP').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

            // Lấy id của loại sản phẩm từ ID của form
            const id = this.getAttribute('id').replace('updateLoaiSP', '');
            console.log(id);

            // Lấy các giá trị từ form sử dụng ID của loại sản phẩm
            const TenLoaiSP = document.getElementById('TenLoaiSP' + id).value;
            const noFileSelectedIcon = document.getElementById('noFileSelectedIcon' + id).value;
            const Iconn = document.getElementById('Iconn' + id).files[0]; // Đây là file ảnh

            // Tạo formData để chứa dữ liệu form và file ảnh
            const formData = new FormData();
            formData.append('idEdit', id);
            formData.append('TenLoaiSP', TenLoaiSP);
            formData.append('noFileSelectedIcon', noFileSelectedIcon);

            // Kiểm tra xem người dùng đã chọn hình ảnh mới hay không
            if (Iconn) {
                formData.append('Iconn', Iconn);
            }

            // Gửi request fetch để cập nhật loại sản phẩm
            fetch(`/save-loai-sp/${id}`, {
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
                            window.location.reload();
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

    // Lặp qua các form để gán sự kiện submit --- hãng sx
    document.querySelectorAll('.editHangSx').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

            // Lấy id của loại sản phẩm từ ID của form
            const id = this.getAttribute('id').replace('editHangSx', '');
            console.log(id);

            // Lấy các giá trị từ form sử dụng ID của loại sản phẩm
            const TenHangSX = document.getElementById('TenHangSX' + id).value;
            // Lấy tất cả các giá trị được chọn từ select element
            const selectElement = document.getElementById('IdLoaiSP' + id);
            const selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);

            // Tạo formData để chứa dữ liệu form 
            const formData = new FormData();
            formData.append('idEditHangSx', id);
            formData.append('SuaTenHangSX', TenHangSX);
            selectedValues.forEach(value => formData.append('SuaIdLoaiSP[]', value));

            // Gửi request fetch để cập nhật loại sản phẩm
            fetch(`/sua-hang-sx/${id}`, {
                method: 'PUT',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {                    
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
