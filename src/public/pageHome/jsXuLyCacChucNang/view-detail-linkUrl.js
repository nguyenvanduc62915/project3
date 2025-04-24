document.addEventListener('DOMContentLoaded', (event) => {
    // Lấy dữ liệu sản phẩm từ thẻ input ẩn
    const productData = document.getElementById('product-data').value;
    const product = JSON.parse(productData);

    // Cập nhật nội dung các phần tử modal với dữ liệu sản phẩm
    document.getElementById('TenSP-detail-url').innerHTML = product.TenSP;
    document.getElementById('TenHangSX-detail-url').innerHTML = product.IdHangSX.TenHangSX;
    document.getElementById('MoTa-detail-url').innerHTML = product.MoTa;
    document.getElementById('MoTaChiTietODay').innerHTML = product.MoTaChiTiet;
    document.getElementById('idVaoDay-url').value = product._id;
    document.getElementById('SoLuongTon-url').value = product.SoLuongTon;

    

    const sizeSelect = document.getElementById('size-selectt');
    sizeSelect.innerHTML = '';

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }  

    if (product.sizeQuantity && product.sizeQuantity.length > 0) {
        product.sizeQuantity.forEach((sq, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = sq.size;
            option.dataset.price = sq.price;
            sizeSelect.appendChild(option);
            console.log(`Option added: ${sq.size}, price: ${sq.price}`);
        });
        
        // Set initial price
        if(product.GiamGiaTheoNgay > 0){
            let sale = product.sizeQuantity[0].price * (product.GiamGiaTheoNgay / 100)
            document.getElementById('price-pro-detail-url').innerText = `${formatCurrency(product.sizeQuantity[0].price - sale)}`;
            document.getElementById('old-price-detail-url').innerHTML = `${formatCurrency(product.sizeQuantity[0].price)}`;
            document.getElementById('giaNew-url').value = product.sizeQuantity[0].price - sale
            document.getElementById('giaChuaGiam-url').value = `${(product.sizeQuantity[0].price)}`;
            document.getElementById('sizeMua-url').value = product.sizeQuantity[0].size;

            // Add change event listener to update price on size change
            sizeSelect.addEventListener('change', function() {
                const selectedIndex = this.value;
                const selectedPrice = product.sizeQuantity[selectedIndex].price;
                const giam_gia_theo_ngay = selectedPrice * (product.GiamGiaTheoNgay / 100);
                const finalPrice = selectedPrice - giam_gia_theo_ngay;
                document.getElementById('price-pro-detail-url').innerText = `${formatCurrency(finalPrice)}`;
                document.getElementById('old-price-detail-url').innerHTML = `${formatCurrency(selectedPrice)}`;
                document.getElementById('giaNew-url').value = finalPrice
                document.getElementById('giaChuaGiam-url').value = selectedPrice
                document.getElementById('sizeMua-url').value = product.sizeQuantity[selectedIndex].size;
            });
        } else {
            // document.getElementById('price-pro').innerText = `${formatCurrency(product.sizeQuantity[0].price)}`;
            let sale = product.sizeQuantity[0].price * (product.GiamGiaSP / 100)
            document.getElementById('price-pro-detail-url').innerText = `${formatCurrency(product.sizeQuantity[0].price - sale)}`;
            document.getElementById('old-price-detail-url').innerHTML = `${formatCurrency(product.sizeQuantity[0].price)}`;
            document.getElementById('giaNew-url').value = product.sizeQuantity[0].price - sale
            document.getElementById('giaChuaGiam-url').value = `${(product.sizeQuantity[0].price)}`;
            document.getElementById('sizeMua-url').value = product.sizeQuantity[0].size;


            // Add change event listener to update price on size change
            sizeSelect.addEventListener('change', function() {
                const selectedIndex = this.value;
                const selectedPrice = product.sizeQuantity[selectedIndex].price;
                const giam_gia_sp = selectedPrice * (product.GiamGiaSP / 100);
                const finalPrice = selectedPrice - giam_gia_sp;
                document.getElementById('price-pro-detail-url').innerText = `${formatCurrency(finalPrice)}`;
                document.getElementById('old-price-detail-url').innerHTML = `${formatCurrency(selectedPrice)}`;
                document.getElementById('giaNew-url').value = finalPrice
                document.getElementById('giaChuaGiam-url').value = selectedPrice
                document.getElementById('sizeMua-url').value = product.sizeQuantity[selectedIndex].size;
            });
        }
        console.log("Final size-select HTML:", sizeSelect.innerHTML);

    } else {
        // Nếu không có sizeQuantity, đặt giá mặc định
        document.getElementById('price-pro').innerText = '$0.00';
    }
});