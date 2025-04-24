
function handleChangeTheLoai() {
    const sapXepGiaSelect = document.querySelector('select[name="sapXepGia"]');
    const selectedSapXepGia = sapXepGiaSelect.value || "0";
    
    // Lấy giá trị từ thẻ input ẩn
    const idloaisp = document.getElementById('ssIdLoaiSP').value;
    const idHangSX = document.getElementById('ssIdHangSXGT').value;
    const min = document.getElementById('minGT').value;
    const max = document.getElementById('maxGT').value;
    console.log("idloaisp: ", idloaisp);
    console.log("idHangSX: ", idHangSX);
    console.log("min: ", min);
    console.log("max: ", max);

    let url = '/shop-list-category-product';
    let queryParams = '';

    if (idloaisp) {
        queryParams += `?idLoaiSP=${idloaisp}`;
    }

    if (idHangSX) {
        queryParams += `${queryParams ? '&' : '?'}idHangSX=${idHangSX}`;
    }
    if (min) {
        queryParams += `${queryParams ? '&' : '?'}min=${min}`;
    }
    if (max) {
        queryParams += `${queryParams ? '&' : '?'}max=${max}`;
    }

    if (selectedSapXepGia) {
        queryParams += `${queryParams ? '&' : '?'}SapXepTheoGia=${selectedSapXepGia}`;
    }


    url += queryParams;
    window.location.href = url;
}
