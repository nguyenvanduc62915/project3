document.addEventListener('DOMContentLoaded', function () {
    updateCTCart(); // Gọi hàm cập nhật thông tin giỏ hàng khi trang được tải

    async function updateCTCart() {
        try {
            const response = await fetch('/get-chi-tiet-cart'); // Gửi yêu cầu GET đến '/get-chi-tiet-cart'
            const data = await response.json(); // Chuyển đổi phản hồi thành JSON
            console.log("data => ", data);

            const cartItemsContainer = document.getElementById('cartProductList');
            cartItemsContainer.innerHTML = ''; // Xóa nội dung hiện tại của danh sách

            if (data.success && data.productDetails.length > 0) {
                data.productDetails.forEach(item => {
                    const productElement = document.createElement('li');

                    productElement.innerHTML = `
                        <a href="/detailt-sp-linkUrl?idDetailTrangMoi=${item.productDetails._id}" class="minicart-product-image">
                            <img width="100" height="50" src="images/upload/${getRelativeImagePath(item.productDetails.Icon[0])}" alt="cart products">
                        </a>
                        <div class="minicart-product-details">
                            <h6><a href="/detailt-sp-linkUrl?idDetailTrangMoi=${item.productDetails._id}">${item.productDetails.TenSP}</a></h6>
                            <span style="color: red; font-weight: 500">${formatCurrency(item.donGia)}  </span>
                            <span style="text-decoration: line-through;font-style: italic; padding: 5px 10px;color: grey;"> ${formatCurrency(item.giaChuaGiam)} </span>
                            
                            <span style="float: right; color: blue; font-weight: 500">x${item.qty}</span>
                            
                            <p style="color: black; font-weight: 500">
                                Cấu hình: &nbsp; <span style="color: navy; font-weight: 450">${item.size}</span>
                            </p>
                        </div>
                    `;

                    cartItemsContainer.appendChild(productElement);
                });

                document.getElementById('cartTotalPrice').innerText = formatCurrency(data.cartItemss.totalCartPrice);
            } else {
                const emptyMessage = document.createElement('li');
                emptyMessage.innerText = "Giỏ hàng trống";
                cartItemsContainer.appendChild(emptyMessage);

                // Ẩn div có id là checkRong
                document.getElementById('checkRong').style.display = 'none';
                document.getElementById('checkRong1').style.display = 'none';
            }

        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin giỏ hàng:', error);
        }
    }

    // Hàm định dạng tiền tệ (có thể thay đổi theo định dạng tiền của bạn)
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    // rút gọn file ảnh chỉ lấy tên ảnh, ví dụ: abc.png
    function getRelativeImagePath(absolutePath) {
        const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
        const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
        return relativePath;
    }
});