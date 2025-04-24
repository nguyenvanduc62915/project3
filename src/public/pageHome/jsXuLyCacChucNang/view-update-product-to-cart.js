document.addEventListener('DOMContentLoaded', function() {
    var viewDetailLinks = document.querySelectorAll('[id^="viewUpdateProductCart"]');
    viewDetailLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            // var productId = link.dataset.productId;
            var productId = link.id.replace('viewUpdateProductCart', '');
            console.log("productId: ", productId);
            fetch('/chi-tiet-sp-update-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idDetailTaiTrang: productId })
            })
            .then(response => response.json())
            .then(data => {

                if (data.success) {
                    const productArray = data.data;
                    console.log("productArray: ", productArray);
                    const product = productArray.find(item => {
                        console.log("item.productDetails._id: ", item.productDetails._id);
                        
                        return  item.productDetails._id.toString() === productId.toString()
                    });
                    
                    console.log("product: ", product);
                    let tongSoLuongMua = document.getElementById('SoLuongMua' + productId).value
                    console.log("SoLuongMua: ", tongSoLuongMua);

                    const sizeSelect = document.getElementById('size-select' + productId);
                    sizeSelect.innerHTML = '';

                    // format tiền tệ
                    function formatCurrency(amount) {
                        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
                    }  
                    
                    if (product.productDetails.sizeQuantity && product.productDetails.sizeQuantity.length > 0) {
                        let selectedSizeIndex = -1;
                        product.productDetails.sizeQuantity.forEach((sq, index) => {
                            const option = document.createElement('option');
                            option.style.fontSize = '18px';
                            option.value = index;
                            option.textContent = sq.size;
                            option.dataset.price = sq.price;
                            if (sq.size === product.size) { // Sử dụng product.size để đặt selected
                                option.selected = true;
                                selectedSizeIndex = index;
                            }
                            sizeSelect.appendChild(option);
                            console.log(`Option added: ${sq.size}, price: ${sq.price}`);
                        });

                        if (selectedSizeIndex !== -1) {
                            // Set initial price based on selected size
                            const selectedPrice = product.productDetails.sizeQuantity[selectedSizeIndex].price;
                            const discount = product.productDetails.GiamGiaTheoNgay > 0 ? product.productDetails.GiamGiaTheoNgay : product.productDetails.GiamGiaSP;
                            const sale = selectedPrice * (discount / 100);
                            const finalPrice = selectedPrice - sale;

                            const tongTien = tongSoLuongMua * finalPrice

                            document.getElementById('price-product' + productId).value = `${formatCurrency(finalPrice)}`;
                            document.getElementById('old-price' + productId).innerHTML = `${formatCurrency(selectedPrice)}`;
                            document.getElementById('old-price-input' + productId).value = `${formatCurrency(selectedPrice)}`;
                            document.getElementById('tongTien' + productId).value = `${formatCurrency(tongTien)}`;
                        }

                        // Add change cho select cấu hình
                        sizeSelect.addEventListener('change', function() {
                            const selectedIndex = this.value;
                            const selectedPrice = product.productDetails.sizeQuantity[selectedIndex].price;
                            const discount = product.productDetails.GiamGiaTheoNgay > 0 ? product.productDetails.GiamGiaTheoNgay : product.productDetails.GiamGiaSP;
                            const sale = selectedPrice * (discount / 100);
                            const finalPrice = selectedPrice - sale;

                            const tongTien = tongSoLuongMua * finalPrice

                            document.getElementById('price-product' + productId).value = `${formatCurrency(finalPrice)}`;
                            document.getElementById('old-price' + productId).innerHTML = `${formatCurrency(selectedPrice)}`;
                            document.getElementById('old-price-input' + productId).value = `${formatCurrency(selectedPrice)}`;
                            document.getElementById('tongTien' + productId).value = `${formatCurrency(tongTien)}`;
                            console.log("finalPrice: ", finalPrice);
                        });

                        console.log("Final size-select HTML:", sizeSelect.innerHTML);
                    } else {
                        document.getElementById('price-product' + productId).value = formatCurrency(0);
                    }

                    // Add change cho phần Số lượng mua
                    const quantityInput = document.getElementById('SoLuongMua' + productId);
                    quantityInput.addEventListener('change', function() {
                        tongSoLuongMua = this.value;
                        const selectedSizeIndex = sizeSelect.value;
                        const selectedPrice = product.productDetails.sizeQuantity[selectedSizeIndex].price;
                        const discount = product.productDetails.GiamGiaTheoNgay > 0 ? product.productDetails.GiamGiaTheoNgay : product.productDetails.GiamGiaSP;
                        const sale = selectedPrice * (discount / 100);
                        const finalPrice = selectedPrice - sale;
                        const tongTien = tongSoLuongMua * finalPrice;

                        document.getElementById('tongTien' + productId).value = `${formatCurrency(tongTien)}`;
                    });
                    
                } else {
                    console.error("Error:", data.message);
                }

            })
            .catch(error => console.error('Error:', error));
        });
    });
});
