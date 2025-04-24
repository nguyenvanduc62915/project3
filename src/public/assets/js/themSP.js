// Hàm để định dạng số tiền
function formatCurrency(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm để thêm trường nhập thông tin size, quantity và price
function addSizeInput() {
    const sizeInputs = document.getElementById("sizeInputs");
    const index = sizeInputs.children.length / 3; // Sử dụng length để tính chỉ số
    const sizeInput = document.createElement("div");
    sizeInput.classList.add("form-group", "col-md-4");
    sizeInput.innerHTML = `
        <label for="size${index}" class="form-control-label text-sm">Size:</label>
        <input style="border: none; font-size: 14px;" type="text" id="size${index}" name="size${index}" class="form-control" placeholder="Nhập Size ${index + 1} vào đây..."><br>
    `;

    const quantityInput = document.createElement("div");
    quantityInput.classList.add("form-group", "col-md-4");
    quantityInput.innerHTML = `
        <label for="quantity${index}" class="form-control-label text-sm">Số lượng:</label>
        <input class="form-control" type="number" id="quantity${index}" name="quantity${index}" placeholder="Số lượng size ${index + 1}..."><br>
    `;

    // const priceInput = document.createElement("div");
    // priceInput.classList.add("form-group", "col-md-4");
    // priceInput.innerHTML = `
    //     <label for="price${index}" class="form-control-label text-sm">Đơn giá:</label>
    //     <input class="form-control" type="number" id="price${index}" name="price${index}" placeholder="Đơn giá size ${index + 1}..."><br>
    // `;
    const priceInput = document.createElement("div");
    priceInput.classList.add("form-group", "col-md-4");
    priceInput.innerHTML = `
        <label for="price${index}" class="form-control-label text-sm">Đơn giá:</label>
        <input class="form-control" type="text" id="price${index}" name="price${index}" placeholder="Đơn giá size ${index + 1}..."><br>
    `;

    // Thêm các phần tử input vào trong div #sizeInputs
    sizeInputs.appendChild(sizeInput);
    sizeInputs.appendChild(quantityInput);
    sizeInputs.appendChild(priceInput);

     // Thêm sự kiện cho ô nhập giá
    const priceInputElement = priceInput.querySelector('input');
    priceInputElement.addEventListener('input', function() {
        // Loại bỏ tất cả các ký tự không phải số
        let value = this.value.replace(/\D/g, '');
        if (value) {
            this.value = formatCurrency(value);
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('themSPForm');

    submitForm.addEventListener('submit', function(event) {
        // event.preventDefault(); // Ngăn chặn gửi yêu cầu mặc định của form
        const formData = new FormData(); // Khởi tạo formData mới

        // Lặp qua tất cả các trường input của size, quantity và price để lấy giá trị và thêm vào formData
        const sizeInputs = document.querySelectorAll('[id^="size"]');
        const quantityInputs = document.querySelectorAll('[id^="quantity"]');
        const priceInputs = document.querySelectorAll('[id^="price"]');

        sizeInputs.forEach((sizeInput, index) => {
            formData.append(`size${index}`, sizeInput.value);
        });

        quantityInputs.forEach((quantityInput, index) => {
            formData.append(`quantity${index}`, quantityInput.value);
        });

        priceInputs.forEach((priceInput, index) => {
            // Loại bỏ dấu chấm trước khi thêm vào formData
            const priceValue = priceInput.value.replace(/\./g, '');
            formData.append(`price${index}`, priceInput.value);
        });

        // Thêm các trường input khác vào formData nếu cần
        // Ví dụ: formData.append('TenSP', document.getElementById('TenSP').value);
        const files = document.getElementById('Icon').files;
        for (let i = 0; i < files.length; i++) {
            formData.append('Icon', files[i]);
        }

        const TenSP = document.getElementById('TenSP').value;
        const GiamGiaSP = document.getElementById('GiamGiaSP').value;
        const IdHangSX = document.getElementById('IdHangSX').value;
        const MoTa = CKEDITOR.instances.MoTa.getData();
        const MoTaChiTiet = CKEDITOR.instances.MoTaChiTiet.getData();

        formData.append('TenSP', TenSP);
        formData.append('GiamGiaSP', GiamGiaSP);
        formData.append('IdHangSX', IdHangSX);
        formData.append('MoTa', MoTa);
        formData.append('MoTaChiTiet', MoTaChiTiet);

        // Gửi request
        fetch('/create-spp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
                    window.location.href = '/list-quan-ly-sp';
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
        .catch(error => console.error('Error:', error));

    });
});