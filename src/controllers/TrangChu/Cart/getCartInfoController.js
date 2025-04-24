const SanPham = require("../../../models/SanPham")
const HangSX = require("../../../models/HangSX")
const LoaiSP = require("../../../models/LoaiSP")
const Cart = require("../../../models/Cart")
require('rootpath')()


module.exports = {

    // Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
    getCartInfo: async (req, res) => {
        try {
            const customerAccountId = req.session.userId;
            console.log("check userId get cart: ", customerAccountId);
    
            const cart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId');
            const sp = await Cart.find({ MaTKKH: customerAccountId }).populate('cart.items.productId');
            console.log("check sp get cart: ", sp);
    
            if (!cart) {
                return res.status(200).json({ totalQuaty: 0, totalPrice: 0 });
            }
    
            // Tính tổng số lượng và tổng tiền
            let totalQuaty = 0;
            let totalPrice = 0;
            let phiShip = 30000;
            let giamGia = 0;
    
            for (const item of cart.cart.items) {                
                totalQuaty += item.qty;
                totalPrice += item.qty * item.donGia; 
            }                            

            // Thêm thông tin vào đối tượng JSON
            const cartInfo = {
                totalQuaty: totalQuaty,
                totalPrice: totalPrice ,    
                phiShip: phiShip,
                giamGia: giamGia                    
            };
    
            return res.status(200).json(cartInfo);    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    // hiển thị thông tin chi tiết giỏ hàng trên thanh công cụ
    getChiTietCart: async (req, res) => {
        try {
            const customerAccountId = req.session.userId;
            const detailCart = await Cart.findOne({ MaTKKH: customerAccountId }).exec();
    
            if (!detailCart) {
                console.log("Giỏ hàng trống");
                return res.json({ success: false, message: "Giỏ hàng trống" });
            }
    
            const cartItems = detailCart.cart.items;
            const productDetailsArray = await Promise.all(cartItems.map(async item => {
                // console.log(`item._id cần xóa: ${item._id}`); // xem id can xoa
    
                try {
                    const productDetails = await SanPham.findById(item.productId).populate('IdLoaiSP').populate('IdHangSX').exec();
                    // console.log("productDetails: ",productDetails);
    
                    if (productDetails) {
                        const { TenSP, GiaBan } = productDetails;
                        const totalPriceForItem = item.qty * item.donGia;
    
                        return {
                            productDetails,
                            qty: item.qty,
                            size: item.size,
                            donGia: item.donGia,
                            giaChuaGiam: item.giaChuaGiam,
                            totalPriceForItem,
                            _id: item._id
                        };
                    } else {
                        console.log("Không tìm thấy chi tiết sản phẩm cho mặt hàng:", item.productId);
                        return null;
                    }
                } catch (error) {
                    console.error("Lỗi khi truy xuất chi tiết sản phẩm:", error);
                    return null;
                }
            }));
    
            const totalCartPrice = cartItems.reduce((acc, cur) => acc + cur.qty * cur.donGia, 0);
    
            res.json({
                success: true,
                productDetails: productDetailsArray.filter(Boolean),
                cartItemss: { items: cartItems, totalCartPrice: totalCartPrice }
            });
        } catch (error) {
            console.error("Lỗi khi truy xuất giỏ hàng:", error);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy xuất giỏ hàng." });
        }
    }
}