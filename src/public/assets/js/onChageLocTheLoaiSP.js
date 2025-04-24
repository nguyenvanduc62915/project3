// cách 1: 
function handleChangeTheLoai1() {
    const theLoaiSelect = document.querySelector('select[name="theLoai"]');
    const sapXepGiaSelect = document.querySelector('select[name="sapXepGia"]');

    const selectedTheLoai = theLoaiSelect.value || "";
    const selectedSapXepGia = sapXepGiaSelect.value
    if (!selectedSapXepGia) {
        selectedSapXepGia = "0"; // Đặt mặc định là 0 nếu không có giá trị từ máy chủ
    }

    let url = '/list-quan-ly-sp';

    if (theLoaiSelect) {
        if (url.includes('?')) { 
            url += `&searchSP_TheLoaiSP=${selectedTheLoai}`;
        } else {
            url += `?searchSP_TheLoaiSP=${selectedTheLoai}`;
        }
    }

    if (url.includes('?')) {    // kiểm tra xem URL đã chứa dấu ? hay chưa
        url += `&SapXepTheoGia=${selectedSapXepGia}`;
    } else {
        url += `?SapXepTheoGia=${selectedSapXepGia}`;
    }
    
    window.location.href = url;
}

// cách 2: lọc theo thể loại và sắp xếp theo GiaBan tăng/giảm
function handleChangeTheLoai() {
    const theLoaiSelect = document.querySelector('select[name="theLoai"]');
    const sapXepGiaSelect = document.querySelector('select[name="sapXepGia"]');
    const locTheoGiaSelect = document.querySelector('select[name="LocTheoGia"]');

    const selectedTheLoai = theLoaiSelect.value || "";
    const selectedSapXepGia = sapXepGiaSelect.value || "0";
    const selectedLocTheoGia = locTheoGiaSelect.value || "10000-99999999";
    

    let url = '/list-quan-ly-sp';
    let queryParams = '';

    if (selectedTheLoai) {
        queryParams += `?searchSP_TheLoaiSP=${selectedTheLoai}`;
    }
    if (selectedSapXepGia) {
        queryParams += `${queryParams ? '&' : '?'}SapXepTheoGia=${selectedSapXepGia}`;
    }
    if (selectedLocTheoGia) {
        queryParams += `${queryParams ? '&' : '?'}LocTheoGia=${selectedLocTheoGia}`;
    }

    url += queryParams;
    window.location.href = url;
}
