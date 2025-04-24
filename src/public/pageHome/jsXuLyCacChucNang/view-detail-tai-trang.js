document.addEventListener('DOMContentLoaded', function() {
    var viewDetailLinks = document.querySelectorAll('[id^="viewDetailt"]');
    viewDetailLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            // var productId = link.dataset.productId;
            var productId = link.id.replace('viewDetailt', '');
            fetch('/detailt-sp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idDetailTaiTrang: productId })
            })
            .then(response => response.json())
            .then(data => {
                // Lấy dữ liệu từ API
                const product = data.dataProductDetail;
                console.log("pro: ", product);
                console.log("product.Icon[0]: ", product.Icon[0]);
                product.Icon.forEach((imgUrl) => {
                    console.log("product.Icon: ", imgUrl);
                    
                });

                // Cập nhật nội dung các phần tử modal với dữ liệu sản phẩm
                document.getElementById('TenSP').innerHTML = product.TenSP;
                document.getElementById('TenHangSX').innerHTML = product.IdHangSX.TenHangSX;
                document.getElementById('MoTa').innerHTML = product.MoTa;                
                document.getElementById('idVaoDay').value = product._id;
                document.getElementById('SoLuongTon').value = product.SoLuongTon;

                document.getElementById('anh-to-1').src = product.Icon[0];
                document.getElementById('anh-to-2').src = product.Icon[1];
                document.getElementById('anh-to-3').src = product.Icon[2];
                document.getElementById('anh-to-4').src = product.Icon[3];
                document.getElementById('anh-to-5').src = product.Icon[4];
                document.getElementById('anh-to-6').src = product.Icon[5];

                document.getElementById('anh-nho-1').src = product.Icon[0];
                document.getElementById('anh-nho-2').src = product.Icon[1];
                document.getElementById('anh-nho-3').src = product.Icon[2];
                document.getElementById('anh-nho-4').src = product.Icon[3];
                document.getElementById('anh-nho-5').src = product.Icon[4];
                document.getElementById('anh-nho-6').src = product.Icon[5];

                const sizeSelect = document.getElementById('size-select');
                sizeSelect.innerHTML = '';

                // format tiền tệ
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
                        document.getElementById('price-pro').innerText = `${formatCurrency(product.sizeQuantity[0].price - sale)}`;
                        document.getElementById('old-price').innerHTML = `${formatCurrency(product.sizeQuantity[0].price)}`;
                        document.getElementById('giaNew').value = `${(product.sizeQuantity[0].price - sale)}`;
                        document.getElementById('giaChuaGiam').value = `${(product.sizeQuantity[0].price)}`;
                        document.getElementById('sizeMua').value = product.sizeQuantity[0].size;

                        // Add change event listener to update price on size change
                        sizeSelect.addEventListener('change', function() {
                            const selectedIndex = this.value;
                            const selectedPrice = product.sizeQuantity[selectedIndex].price;
                            const giam_gia_theo_ngay = selectedPrice * (product.GiamGiaTheoNgay / 100);
                            const finalPrice = selectedPrice - giam_gia_theo_ngay;
                            document.getElementById('price-pro').innerText = `${formatCurrency(finalPrice)}`;
                            document.getElementById('old-price').innerHTML = `${formatCurrency(selectedPrice)}`;
                            document.getElementById('giaNew').value = finalPrice;
                            document.getElementById('giaChuaGiam').value = selectedPrice
                            document.getElementById('sizeMua').value = product.sizeQuantity[selectedIndex].size;
                        });
                    } else {
                        // document.getElementById('price-pro').innerText = `${formatCurrency(product.sizeQuantity[0].price)}`;
                        let sale = product.sizeQuantity[0].price * (product.GiamGiaSP / 100)
                        document.getElementById('price-pro').innerText = `${formatCurrency(product.sizeQuantity[0].price - sale)}`;
                        document.getElementById('old-price').innerHTML = `${formatCurrency(product.sizeQuantity[0].price)}`;
                        document.getElementById('giaNew').value = `${(product.sizeQuantity[0].price - sale)}`;
                        document.getElementById('giaChuaGiam').value = `${(product.sizeQuantity[0].price)}`;
                        document.getElementById('sizeMua').value = product.sizeQuantity[0].size;

                        // Add change event listener to update price on size change
                        sizeSelect.addEventListener('change', function() {
                            const selectedIndex = this.value;
                            const selectedPrice = product.sizeQuantity[selectedIndex].price;
                            const giam_gia_sp = selectedPrice * (product.GiamGiaSP / 100);
                            const finalPrice = selectedPrice - giam_gia_sp;
                            document.getElementById('price-pro').innerText = `${formatCurrency(finalPrice)}`;
                            document.getElementById('old-price').innerHTML = `${formatCurrency(selectedPrice)}`;
                            document.getElementById('giaNew').value = finalPrice;
                            document.getElementById('giaChuaGiam').value = selectedPrice
                            document.getElementById('sizeMua').value = product.sizeQuantity[selectedIndex].size;
                        });
                    }


                    

                    console.log("Final size-select HTML:", sizeSelect.innerHTML);

                } else {
                    // Nếu không có sizeQuantity, đặt giá mặc định
                    document.getElementById('price-pro').innerText = '$0.00';
                }

                // // Hiển thị hình ảnh lớn và hình ảnh nhỏ
                // const largeImagesContainer = document.getElementById('large-images');
                // const thumbImagesContainer = document.getElementById('thumb-images');

                // // Xóa nội dung hiện tại trong các phần tử container (nếu cần)
                // largeImagesContainer.innerHTML = '';
                // thumbImagesContainer.innerHTML = '';

                // // Tạo nội dung HTML cho các hình ảnh lớn và nhỏ
                // let largeImagesHTML = '';
                // let thumbImagesHTML = '';

                // if (Array.isArray(product.Icon)) {
                //     product.Icon.forEach((imgUrl) => {
                //         largeImagesHTML += `<div class="lg-image"><img src="${imgUrl}" alt="product image"></div>`;
                //         thumbImagesHTML += `<div class="sm-image"><img src="${imgUrl}" alt="product image thumb"></div>`;
                //     });
                // }

                // // Chèn nội dung HTML vào các container
                // largeImagesContainer.innerHTML = largeImagesHTML;
                // thumbImagesContainer.innerHTML = thumbImagesHTML;

                // // Kiểm tra nội dung HTML được tạo ra
                // console.log("Large Images HTML: ", largeImagesHTML);
                // console.log("Thumb Images HTML: ", thumbImagesHTML);

                // // Khởi tạo lại slider sau khi chèn các phần tử
                // if ($('.slider-navigation-1').hasClass('slick-initialized')) {
                //     $('.slider-navigation-1').slick('unslick');
                // }
                // if ($('.slider-thumbs-1').hasClass('slick-initialized')) {
                //     $('.slider-thumbs-1').slick('unslick');
                // }

                // $('.slider-navigation-1').slick({
                //     slidesToShow: 1,
                //     slidesToScroll: 1,
                //     arrows: true,
                //     fade: true,
                //     asNavFor: '.slider-thumbs-1',
                //     prevArrow: '<button type="button" style="background: transparent;" class="slick-prev"></button>',
                //     nextArrow: '<button type="button" style="background: transparent;" class="slick-next"></button>'
                // });

                // $('.slider-thumbs-1').slick({
                //     slidesToShow: 4,
                //     slidesToScroll: 1,
                //     asNavFor: '.slider-navigation-1',
                //     dots: true,
                //     centerMode: true,
                //     focusOnSelect: true,
                //     prevArrow: '<button type="button" style="background: transparent;" class="slick-prev"></button>',
                //     nextArrow: '<button type="button" style="background: transparent;" class="slick-next"></button>'
                // });
                
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
