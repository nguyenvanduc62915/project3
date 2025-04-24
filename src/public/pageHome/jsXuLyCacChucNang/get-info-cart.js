document.addEventListener('DOMContentLoaded', function () {
    updateCartInfo(); // Gọi hàm cập nhật thông tin giỏ hàng khi trang được tải

    // Hàm cập nhật thông tin giỏ hàng
    async function updateCartInfo() {
        try {
            const response = await fetch('/get-info-cart');
            const data = await response.json();
            console.log("data => ", data);

            // Cập nhật tổng số lượng và tổng tiền trên giao diện
            document.getElementById('totalQuantity').innerText = data.totalQuaty;

            if(data.totalQuaty == 0) {
                document.getElementById('totalPrice').innerText = '0đ';
            } else {
                document.getElementById('totalPrice').innerText = formatCurrency(data.totalPrice);
            }            

            if(data.totalQuaty == 0) {
                document.getElementById('cartTotalPrice').innerText = '0đ';
            } else {
                document.getElementById('cartTotalPrice').innerText = formatCurrency(data.totalPrice );
            }

            // if(data.phiShip === 0) {
            //     document.getElementById('shipping_price').innerText = 'Miễn Phí Giao Hàng';
            // } else if(data.totalQuaty == 0) {
            //     document.getElementById('shipping_price').innerText = '0đ';
            // } else {
            //     document.getElementById('shipping_price').innerText = formatCurrency(data.phiShip);
            // }

            // document.getElementById('giamgia_price').innerText = '-' + formatCurrency(data.giamGia);
            // var giamGiaPercent = Math.floor((data.giamGia / data.totalPrice) * 100); // Tính phần trăm giảm giá
            // Kiểm tra xem giamGiaPercent có phải là NaN không
            // if (isNaN(giamGiaPercent)) {
            //     giamGiaPercent = 0; // Nếu là NaN, đặt giá trị mặc định là 0
            // }
            // document.getElementById('giamgia_price_txt').innerText = 'Giảm Giá ' + giamGiaPercent + '%';

        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin giỏ hàng:', error);
        }
    }   

    // Hàm định dạng tiền tệ (có thể thay đổi theo định dạng tiền của bạn)
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    
});