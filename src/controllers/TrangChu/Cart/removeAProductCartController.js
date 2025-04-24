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

    // xóa 1 sản phẩm trong giỏ hàng
    removeAProductCart: async (req, res) => {
        try {
            let idARemove = req.params.idARemove
            console.log("idRemove: ", idARemove);            

            const removeAProduct = await Cart.findOneAndUpdate(
                // Tìm tài liệu có phần tử trong mảng items với _id bằng idARemove
                { "cart.items._id": idARemove },  

                // Loại bỏ phần tử có _id bằng idARemove khỏi mảng items
                { $pull: { "cart.items": { _id: idARemove } } },  

                // Trả về tài liệu đã cập nhật thay vì tài liệu gốc
                { new: true }  
            )

            // Kiểm tra xem sản phẩm đã được tìm thấy và xóa chưa
            if (removeAProduct && removeAProduct.cart && removeAProduct.cart.items) {
                let totalQuaty = 0;
                // Tính tổng giá và tổng số lượng cập nhật dựa trên các mặt hàng còn lại
                for (const item of removeAProduct.cart.items) {
                try {
                    let productDetails = await SanPham.findById(item.productId).exec();
                    if (productDetails) {
                        totalQuaty += item.qty;
                    }
                } catch (error) {
                    console.error("Lỗi tính toán itemTotal:", error);
                }
                }

                // Cập nhật tổng giá và tổng số lượng trong Giỏ hàng
                await Cart.findByIdAndUpdate(
                    { _id: removeAProduct._id },
                    { $set: { "cart.totalQuaty": totalQuaty } }
                );        

                return res.status(200).json({ success: true, message: 'Đã xoá sản phẩm khỏi giỏ hàng thành công'});
                // res.redirect("/get-chi-tiet-cart-url");
            } else {
                return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm để xóa.' });
                // res.status(404).send("Không tìm thấy sản phẩm để xóa.");
            }

        } catch(error) {
            console.error("Lỗi xóa sản phẩm:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}