// thêm loại sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    const btnSubmit = document.getElementById('createLoaiSP');

    btnSubmit.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

        // Lấy các giá trị từ form
        const TenLoaiSP = document.getElementById('TenLoaiSP').value;        
        const Icon = document.getElementById('Icon').files[0]; // Đây là file ảnh
        

        // Tạo formData để chứa dữ liệu form và file ảnh
        const formData = new FormData();
        formData.append('TenLoaiSP', TenLoaiSP);        
        formData.append('Icon', Icon);

        // Gửi request fetch để tạo mới sản phẩm
        fetch('/create-loai-sp', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                if(!data.check){
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành Công!',
                        text: data.message,
                        confirmButtonText: 'OK'
                    })
                    .then(() => {                    
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Không thể thêm!',
                        text: data.message,
                        confirmButtonText: 'OK'
                    })
                }
                
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
    });
});


// thêm hãng sản xuất
function createHangSX() {

    // Lấy các giá trị từ form
    const TenHangSX = document.getElementById('TenHangSX').value;
    const IdLoaiSP = document.getElementById('IdLoaiSP');

    let luuAllIdLoaiSP = [];
    const options = IdLoaiSP.options;

    // Duyệt qua các option và kiểm tra xem option nào được chọn
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            luuAllIdLoaiSP.push(options[i].value);
        }
    }

    // Dữ liệu cập nhật
    const createData = {
        TenHangSX: TenHangSX,
        IdLoaiSP: luuAllIdLoaiSP,
    };

    fetch(`/create-hang-sx`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData) // Chuyển đổi dữ liệu cập nhật thành chuỗi JSON và gửi đi
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
                window.location.reload();
            });        
        } else {      
            if(!data.check){
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: data.message,
                    confirmButtonText: 'OK SHOP'
                });  
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Không thể thêm!',
                    text: data.message,
                    confirmButtonText: 'OK'
                })
            }  

            // Swal.fire({
            //     icon: 'error',
            //     title: 'Lỗi!',
            //     text: data.message,
            //     confirmButtonText: 'OK SHOP'
            // });                       
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
