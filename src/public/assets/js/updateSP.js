document.addEventListener('DOMContentLoaded', () => {
    // const sanPham = [
    //     {"size":"128GB","quantity":10,"price":13590000,"_id":"6647d4a1d24b2b6057e7c912"},
    //     {"size":"256GB","quantity":15,"price":17490000,"_id":"6647d4a1d24b2b6057e7c913"},
    //     {"size":"512GB","quantity":6,"price":24390000,"_id":"6647d4a1d24b2b6057e7c914"}
    // ];    
    
    const sizeQuantitiesDiv = document.getElementById("sizeQuantitiesJSON");    
    const sanPham = JSON.parse(sizeQuantitiesDiv.textContent);    

    console.log("sanPham: ",sanPham);

    const sizeInputs = document.getElementById("sizeInputs");

    // Function to format the input value as currency
    function formatCurrency(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }    

    // Add input event listener to format price inputs
    function addPriceInputListener(input) {
        input.addEventListener('input', function () {
            // Remove any existing formatting
            let value = this.value.replace(/\./g, '');
            if (value) {
                // Format the new value
                this.value = formatCurrency(value);
            }
        });
    }

    sanPham.forEach((product, index) => {
        const sizeInput = document.createElement("div");
        sizeInput.classList.add("form-group", "col-md-4");
        sizeInput.innerHTML = `
            <label for="size${index}" class="form-control-label text-sm">Size ${index + 1}:</label>
            <input style="border: none; font-size: 14px;" value="${product.size}" type="text" id="size${index}" name="size${index}" class="form-control" placeholder="Nhập Size ${index + 1} vào đây..."><br>
        `;

        const quantityInput = document.createElement("div");
        quantityInput.classList.add("form-group", "col-md-4");
        quantityInput.innerHTML = `
            <label for="quantity${index}" class="form-control-label text-sm">Số lượng Size ${index + 1}:</label>
            <input class="form-control" type="number" value="${product.quantity}" id="quantity${index}" name="quantity${index}" placeholder="Số lượng size ${index + 1}..."><br>
        `;

        // const priceInput = document.createElement("div");
        // priceInput.classList.add("form-group", "col-md-4");
        // priceInput.innerHTML = `
        //     <label for="price${index}" class="form-control-label text-sm">Đơn giá Size ${index + 1}:</label>
        //     <input class="form-control" type="number" value="${product.price}" id="price${index}" name="price${index}" placeholder="Đơn giá size ${index + 1}..."><br>
        // `;
        const priceInput = document.createElement("div");
        priceInput.classList.add("form-group", "col-md-4");
        priceInput.innerHTML = `
            <label for="price${index}" class="form-control-label text-sm">Đơn giá Size ${index + 1}:</label>
            <input class="form-control" type="text" value="${formatCurrency(product.price.toString())}" id="price${index}" name="price${index}" placeholder="Đơn giá size ${index + 1}..."><br>
        `;

        // Gọi hàm thêm listener cho ô nhập giá
        addPriceInputListener(priceInput.querySelector(`input[type="text"]`));

        // Append the input elements to the sizeInputs container
        sizeInputs.appendChild(sizeInput);
        sizeInputs.appendChild(quantityInput);
        sizeInputs.appendChild(priceInput);
    });

    // Function to add additional size input fields
    function addSizeInput() {
        const index = sizeInputs.children.length / 3; // Calculate index based on number of child elements
        const sizeInput = document.createElement("div");
        sizeInput.classList.add("form-group", "col-md-4");
        sizeInput.innerHTML = `
            <label for="size${index}" class="form-control-label text-sm">Size ${index+1}:</label>
            <input required style="border: none; font-size: 14px;" type="text" id="size${index}" name="size${index}" class="form-control" placeholder="Nhập Size ${index + 1} vào đây..."><br>
        `;

        const quantityInput = document.createElement("div");
        quantityInput.classList.add("form-group", "col-md-4");
        quantityInput.innerHTML = `
            <label for="quantity${index}" class="form-control-label text-sm">Số lượng Size ${index+1}:</label>
            <input required class="form-control" type="number" id="quantity${index}" name="quantity${index}" placeholder="Số lượng size ${index + 1}..."><br>
        `;

        // const priceInput = document.createElement("div");
        // priceInput.classList.add("form-group", "col-md-4");
        // priceInput.innerHTML = `
        //     <label for="price${index}" class="form-control-label text-sm">Đơn giá Size ${index+1}:</label>
        //     <input required class="form-control" type="number" id="price${index}" name="price${index}" placeholder="Đơn giá size ${index + 1}..."><br>
        // `;

        const priceInput = document.createElement("div");
        priceInput.classList.add("form-group", "col-md-4");
        priceInput.innerHTML = `
            <label for="price${index}" class="form-control-label text-sm">Đơn giá Size ${index+1}:</label>
            <input required class="form-control" type="text" id="price${index}" name="price${index}" placeholder="Đơn giá size ${index + 1}..."><br>
        `;
        // Gọi hàm thêm listener cho ô nhập giá
        addPriceInputListener(priceInput.querySelector(`input[type="text"]`));

        // Append the input elements to the sizeInputs container
        sizeInputs.appendChild(sizeInput);
        sizeInputs.appendChild(quantityInput);
        sizeInputs.appendChild(priceInput);

        sizeInput.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    const addButtonContainer = document.createElement("div");
    addButtonContainer.classList.add("col-md-8"); // Adjust this class as needed
    const addButton = document.createElement("button");
    addButton.classList.add("btn", "btn-primary");
    addButton.textContent = "Add Size";
    addButton.addEventListener("click", addSizeInput);

    addButtonContainer.appendChild(addButton);
    sizeInputs.parentNode.appendChild(addButtonContainer);
});


function previewImagesUpdate() {
    
    var previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = ""; // Clear any existing previews
    var files = document.getElementById('Icon').files;
    var imageUrlsInput = document.getElementById('luuAnh');
    var imageUrls = imageUrlsInput.value.split(',');

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
            imageUrls.push(e.target.result); // Add image URL to the hidden input value
        }
        reader.readAsDataURL(files[i]);
    }

    // Update hidden input value with new image URLs
    imageUrlsInput.value = imageUrls.join(',');
}
document.getElementById('Icon').addEventListener('change', function() {
    const fileList = this.files;
    const imageUrls = document.getElementById('luuAnh');
    if (fileList.length === 0) {
        imageUrls.style.display = 'block';
    } else {
        imageUrls.style.display = 'none';
    }                                
});
