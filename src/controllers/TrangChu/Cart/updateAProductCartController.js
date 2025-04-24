const SanPham = require("../../../models/SanPham")
const HangSX = require("../../../models/HangSX")
const LoaiSP = require("../../../models/LoaiSP")
const MaGiamGiaChoKH = require("../../../models/MaGiamGiaChoKH")
const Cart = require("../../../models/Cart")
const TokenKH = require("../../../models/TokenKH")
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");
const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")
require('rootpath')()


module.exports = {

    // xu ly nut update 
    updateAProductCart: async (req, res) => {
        const quantityy = req.body.SoLuongMua;
        const size = req.body.size;
        const donGiaProduct = req.body.donGiaProduct;
        const giaChuaGiam = req.body.giaChuaGiam;
        let idupdateCart = req.params.idupdateCart;
        console.log("idupdateCart: ", idupdateCart);
    
        const customerAccountId = req.session.userId;
        // Tìm giỏ hàng của khách hàng dựa vào MaTKKH
        let timCart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId');
    
        // Tìm sản phẩm cần cập nhật trong giỏ hàng
        const updatedCartItem = timCart.cart.items.find(item => item._id.toString() === idupdateCart);
        
        if (!updatedCartItem) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm cần cập nhật trong giỏ hàng.' });
        }
    
        // Tìm sản phẩm trong kho
        let sp = await SanPham.findOne({ _id: updatedCartItem.productId._id });
        if (!sp) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
        }
    
        // Kiểm tra số lượng tồn kho theo size
        let sizeQuantity = sp.sizeQuantity.find(sq => sq.size === size);
        if (!sizeQuantity) {
            return res.status(400).json({
                success: false,
                message: `Không tìm thấy size "${size}" cho sản phẩm "${sp.TenSP}".`
            });
        }
    
        // Kiểm tra nếu số lượng đặt vượt quá số lượng tồn kho của size
        if (sizeQuantity.quantity < quantityy) {
            let mess = `Sản phẩm "${sp.TenSP}" với size "${size}" chỉ còn ${sizeQuantity.quantity} sản phẩm, không đủ để đặt hàng. Vui lòng chọn số lượng khác!`;
            return res.status(400).json({ success: false, message: mess });
        }
    
        // Cập nhật thông tin sản phẩm trong giỏ hàng
        updatedCartItem.qty = quantityy;
        updatedCartItem.size = size;
        updatedCartItem.donGia = donGiaProduct;
        updatedCartItem.giaChuaGiam = giaChuaGiam;
    
        // Lưu giỏ hàng đã cập nhật
        await timCart.save();
    
        console.log('Số lượng sản phẩm đã được cập nhật thành công.');
        return res.status(200).json({ success: true, message: "Cập nhật thành công!" });
    }
    

}