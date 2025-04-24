const SanPham = require("../../../models/SanPham")
const HangSX = require("../../../models/HangSX")
const LoaiSP = require("../../../models/LoaiSP")
const Cart = require("../../../models/Cart")
require('rootpath')()


module.exports = {

    addToCart1: async (req, res) => {

        // Lấy thông tin đăng nhập của khách hàng từ request
        const customerAccountId = req.session.userId;
        
        const productId = req.query.productId;
        const size = req.body.sizeMua;
        console.log("size: ", size);
        const PriceBanMoi = parseInt(req.body.giaNew);
        const giaChuaGiam = parseInt(req.body.giaChuaGiam);
        const SoLuongTon = req.body.SoLuongTon;
        const qtyy = parseInt(req.body.quantity);
        const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;

        // tìm cái giỏ hàng từ thằng customerAccountId trước
        let idGioHang = await Cart.findOne({MaTKKH: customerAccountId})    
        let cartId = idGioHang._id
        // rồi tiếp theo tìm theo _id của cái giỏ hàng đó để thêm vào hóa đơn
        let giohang = await Cart.findById(cartId).populate('cart.items.productId')
        console.log(">>> check giohang:",giohang);

        // chọc tới items để lấy ra tất cả sp trong giỏ hàng để chút nữa map ra thêm vào hóa đđn
        const cartItems = giohang.cart.items
        for (const item of cartItems) {
            const product = await SanPham.findById(item.productId);

            if (!product || !product.TenSP || !product.SoLuongTon) {
                console.error("Sản phẩm không hợp lệ:", product);
                return res.status(400).json({
                    success: false, 
                    message: 'Sản phẩm không hợp lệ, có thể do sản phẩm nào đó đã hết hàng. Vui lòng liên hệ lại với admin hoặc đặt sản phẩm khác!' 
                });
            }

            // Kiểm tra số lượng tồn kho cho từng size
            let sizeQuantity = product.sizeQuantity.find(sq => sq.size === item.size);
            if (!sizeQuantity) {
                return res.status(400).json({
                    success: false, 
                    message: `Không tìm thấy size "${item.size}" trong sản phẩm "${product.TenSP}".`
                });
            }

            // Nếu số lượng đặt lớn hơn số lượng tồn kho, trả về thông báo lỗi
            if (sizeQuantity.quantity < item.qty) {
                let errorMessage = `Sản phẩm "${product.TenSP}" với size "${item.size}" chỉ còn ${sizeQuantity.quantity} sản phẩm, không đủ để đặt hàng. Vui lòng kiểm tra lại giỏ hàng của bạn hoặc liên hệ lại với admin!`;
                console.error("Số lượng tồn kho không đủ:", errorMessage);
                return res.status(400).json({ success: false, message: errorMessage });
            }
        }

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await SanPham.findById(productId);
        if (!product) {
            return res.status(404).json({success: false, message: 'Sản phẩm không tồn tại' });
        }
        // let mess = `Số lượng tồn của sản phẩm này chỉ còn ${SoLuongTon} sản phẩm. Vui lòng chọn số lượng hoặc sản phẩm khác!`
        // if(qty > SoLuongTon){
        //     return res.status(404).json({success: false, message: mess });
        // }

        // Kiểm tra xem giỏ hàng đã tồn tại chưa, nếu chưa thì tạo mới
        let cart;

        // Nếu đăng nhập, sử dụng MaTKKH để liên kết với người dùng
        if (customerAccountId) {
            cart = await Cart.findOne({ MaTKKH: customerAccountId });
            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        totalQuaty: 0,
                    },
                    MaTKKH: customerAccountId,
                });
            }
        } else {
            // Nếu không đăng nhập, kiểm tra xem có giỏ hàng trong session hay không
            if (req.session.cartId) {
                // Nếu có giỏ hàng, lấy giỏ hàng từ cơ sở dữ liệu
                cart = await Cart.findById(req.session.cartId);
            }

            // Nếu không có giỏ hàng trong session hoặc database, tạo giỏ hàng mới
            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        // totalPrice: 0,
                        totalQuaty: 0,                            
                    },
                    MaTKKH: null,
                });
            }
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng với kích thước đã cho chưa
        let existingItem;
        for (const item of cart.cart.items) {
            if (item.productId.equals(productId) && item.size === size) {
                existingItem = item;
                break;
            }
        }

        if (existingItem) {
            // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
            existingItem.qty += qty;
        } else {
            // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
            cart.cart.items.push({
                productId: product._id,
                qty: qty,
                donGia: PriceBanMoi,
                giaChuaGiam: giaChuaGiam,
                size: size
            });
        }

        // // Cập nhật tổng số lượng và tổng tiền
        // cart.cart.totalQuaty += qty;
        // cart.cart.totalPrice += product.GiaBan * qty;

        // Cập nhật tổng số lượng và tổng tiền
        cart.cart.totalQuaty = cart.cart.items.reduce((total, item) => total + item.qty, 0);
        // cart.cart.totalPrice = cart.cart.items.reduce((total, item) => total + (item.qty * product.GiaBan), 0);

        //console.log("so luong tong: ", cart.cart.totalQuaty);
        // console.log("gia: ", cart.cart.totalPrice);
        // Lưu cart vào session nếu user không đăng nhập
        if (!customerAccountId) {
            req.session.cart = cart;
        }

        // Lưu giỏ hàng vào cơ sở dữ liệu hoặc session
        if (customerAccountId) {                
            await cart.save();
        }    

        return res.status(200).json({ success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' });
    },

    addToCart: async (req, res) => {

        // Lấy thông tin đăng nhập của khách hàng từ request
        const customerAccountId = req.session.userId;
        const productId = req.query.productId;
        const size = req.body.sizeMua;
        const PriceBanMoi = parseInt(req.body.giaNew);
        const giaChuaGiam = parseInt(req.body.giaChuaGiam);
        const qtyy = parseInt(req.body.quantity);
        const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;
    
        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await SanPham.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }
    
        // Kiểm tra số lượng tồn kho cho từng size
        let sizeQuantity = product.sizeQuantity.find(sq => sq.size === size);
        if (!sizeQuantity) {
            return res.status(400).json({
                success: false,
                message: `Không tìm thấy size "${size}" trong sản phẩm "${product.TenSP}".`
            });
        }
    
        // Nếu số lượng đặt lớn hơn số lượng tồn kho của size, trả về thông báo lỗi
        if (sizeQuantity.quantity < qty) {
            return res.status(400).json({
                success: false,
                message: `Sản phẩm "${product.TenSP}" với size "${size}" chỉ còn ${sizeQuantity.quantity} sản phẩm, không đủ để thêm vào giỏ hàng.`
            });
        }
    
        // Tìm giỏ hàng của khách hàng (nếu có)
        let cart;
        if (customerAccountId) {
            cart = await Cart.findOne({ MaTKKH: customerAccountId });
            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        totalQuaty: 0,
                    },
                    MaTKKH: customerAccountId,
                });
            }
        } else {
            // Nếu không đăng nhập, kiểm tra giỏ hàng trong session
            if (req.session.cartId) {
                cart = await Cart.findById(req.session.cartId);
            }
    
            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        totalQuaty: 0,
                    },
                    MaTKKH: null,
                });
            }
        }
    
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let existingItem;
        for (const item of cart.cart.items) {
            if (item.productId.equals(productId) && item.size === size) {
                existingItem = item;
                break;
            }
        }
    
        if (existingItem) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            existingItem.qty += qty;
        } else {
            // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
            cart.cart.items.push({
                productId: product._id,
                qty: qty,
                donGia: PriceBanMoi,
                giaChuaGiam: giaChuaGiam,
                size: size
            });
        }
    
        // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
        cart.cart.totalQuaty = cart.cart.items.reduce((total, item) => total + item.qty, 0);
    
        // Lưu giỏ hàng vào cơ sở dữ liệu hoặc session
        if (customerAccountId) {
            await cart.save();
        } else {
            req.session.cart = cart;
        }
    
        return res.status(200).json({ success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' });
    }
    
}