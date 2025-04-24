// trường hợp này cho 1 cái input KHÔNG trong vòng lặp
// document.getElementById('Icon').addEventListener('change', function() {
//     const fileList = this.files;    
//     const noFileSelected = document.getElementById('noFileSelectedIcon');
//     if (fileList.length === 0) {
//         noFileSelected.style.display = 'block';
//     } else {
//         noFileSelected.style.display = 'none';
//     }                                
// });

// trường hợp này cho nhiều input có trong vòng lặp --- loại sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    var inputFiles = document.querySelectorAll('.input-file');

    inputFiles.forEach(function(inputFile) {
        inputFile.addEventListener('change', function(event) {
            var fileList = this.files;
            var loaiSPId = this.dataset.loaispId;
            var noFileSelected = document.getElementById('noFileSelectedIcon' + loaiSPId);

            if (fileList.length === 0) {
                noFileSelected.style.display = 'block';
            } else {
                noFileSelected.style.display = 'none';
            }                                
        });
    });
});


// ------------------------------------

// hiển thị hình ảnh tại form khi open file  --- loại sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    var inputFiles = document.querySelectorAll('.input-file');
    var previewImgs = document.querySelectorAll('.preview-img');

    inputFiles.forEach(function(inputFile) {
        inputFile.addEventListener('change', function(event) {
            var fileList = this.files;
            var loaiSPId = this.dataset.loaispId;
            var noFileSelected = document.getElementById('noFileSelectedIcon' + loaiSPId);

            if (fileList.length === 0) {
                noFileSelected.style.display = 'block';
            } else {
                noFileSelected.style.display = 'none';
            }

            var imgElement = document.getElementById('previewImg' + loaiSPId);

            // Kiểm tra xem có tệp nào được chọn không
            if (fileList.length > 0) {
                var file = fileList[0];
                var reader = new FileReader();

                // Đọc nội dung của file ảnh và gán vào thuộc tính src của thẻ img
                reader.onload = function(e) {
                    imgElement.src = e.target.result;
                };

                reader.readAsDataURL(file);
            }
        });
    });
});


// hiển thị hình ảnh khi open file khi tạo sản phẩm
function previewImages() {
    var previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = ""; // Clear any existing previews
    var files = document.getElementById('Icon').files;

    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = document.createElement('img');
            img.height = 100;
            img.width = 100;
            img.style.marginLeft = '5px';
            img.style.marginTop = '10px';
            img.src = e.target.result;
            previewContainer.appendChild(img);
        }
        reader.readAsDataURL(files[i]);
    }
}
// document.getElementById('Icon').addEventListener('change', function(event) {
//     const [file] = event.target.files;
//     if (file) {
//         document.getElementById('imagePreviewIcon').src = URL.createObjectURL(file);
//     }
// });
// document.getElementById('HinhAnh1').addEventListener('change', function(event) {
//     const [file] = event.target.files;
//     if (file) {
//         document.getElementById('imagePreview1').src = URL.createObjectURL(file);
//     }
// });
// document.getElementById('HinhAnh2').addEventListener('change', function(event) {
//     const [file] = event.target.files;
//     if (file) {
//         document.getElementById('imagePreview2').src = URL.createObjectURL(file);
//     }
// });
// document.getElementById('HinhAnh3').addEventListener('change', function(event) {
//     const [file] = event.target.files;
//     if (file) {
//         document.getElementById('imagePreview3').src = URL.createObjectURL(file);
//     }
// });
