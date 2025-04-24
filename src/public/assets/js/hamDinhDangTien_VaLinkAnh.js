// rút gọn file ảnh chỉ lấy tên ảnh, ví dụ: abc.png
function getRelativeImagePath(absolutePath) {
    const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
    const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
    return relativePath;
}

// format tiền tệ
function formatCurrency(amount) {
return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}       


