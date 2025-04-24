
class FormatPriceAndEditImage {
    static formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    static getRelativeImagePath(absolutePath) {
        const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
        const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
        return relativePath;
    }
}

module.exports = FormatPriceAndEditImage;
