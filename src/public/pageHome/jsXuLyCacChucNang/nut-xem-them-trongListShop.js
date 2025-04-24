document.addEventListener('DOMContentLoaded', function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const listItems = document.querySelectorAll('.list-item');
    const loadMoreButton = document.getElementById('load-more');
    let currentlyDisplayed = 3;

    // Hiển thị 3 sản phẩm đầu tiên và ẩn các sản phẩm còn lại
    function initializeProducts(items) {
        items.forEach((item, index) => {
            if (index < currentlyDisplayed) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    initializeProducts(gridItems);
    initializeProducts(listItems);

    // Ẩn nút "Xem thêm" nếu có ít hơn hoặc bằng 3 sản phẩm
    if (gridItems.length <= 3) {
        loadMoreButton.style.display = 'none';
    }

    loadMoreButton.addEventListener('click', function() {
        const nextSet = currentlyDisplayed + 3;
        for (let i = currentlyDisplayed; i < nextSet && i < gridItems.length; i++) {
            gridItems[i].style.display = 'block';
            listItems[i].style.display = 'flex';
        }
        currentlyDisplayed = nextSet;

        // Ẩn nút "Xem thêm" nếu đã hiển thị hết các sản phẩm
        if (currentlyDisplayed >= gridItems.length) {
            loadMoreButton.style.display = 'none';
        }
    });
});
