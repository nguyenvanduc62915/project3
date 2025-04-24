const SanPham = require("../../../models/SanPham")
const HangSX = require("../../../models/HangSX")
const LoaiSP = require("../../../models/LoaiSP")
const MaGiamGiaChoKH = require("../../../models/MaGiamGiaChoKH")
const Cart = require("../../../models/Cart")
const TokenKH = require("../../../models/TokenKH")
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");
const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")
const nodemailer = require('nodemailer');
const HoaDon = require("../../../models/HoaDon")
const { VNPay, ProductCode, VnpLocale, ignoreLogger } = require('vnpay');
require('rootpath')()
require('dotenv').config();

const giamSoLuongTonKho1 = async (productId, quantity) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        let product = await SanPham.findById(productId);

        // Kiểm tra nếu sản phẩm tồn tại và có số lượng tồn kho đủ để giảm
        if (product && product.SoLuongTon >= quantity) {
            // Giảm số lượng tồn kho của sản phẩm
            product.SoLuongTon -= quantity;
            // Lưu sản phẩm sau khi giảm số lượng tồn kho
            await product.save();
            return true; // Trả về true nếu thành công
        } else {
            return false; // Trả về false nếu không đủ số lượng tồn kho
        }
    } catch (error) {
        console.error("Lỗi khi giảm số lượng tồn kho:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};
const giamSoLuongTonKho = async (productId, size, quantity) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        let product = await SanPham.findById(productId);

        // Kiểm tra nếu sản phẩm tồn tại
        if (product) {
            // Tìm size trong mảng sizeQuantity của sản phẩm
            let sizeQuantity = product.sizeQuantity.find(sq => sq.size === size);

            // Nếu tìm thấy size trong mảng sizeQuantity
            if (sizeQuantity) {
                // Kiểm tra nếu số lượng tồn kho đủ để giảm
                if (sizeQuantity.quantity >= quantity) {
                    // Giảm số lượng tồn kho của size
                    sizeQuantity.quantity -= quantity;
                    // Cập nhật lại tổng số lượng tồn kho của sản phẩm
                    product.SoLuongTon = product.sizeQuantity.reduce((total, sq) => total + sq.quantity, 0);

                    // Lưu sản phẩm sau khi giảm số lượng tồn kho
                    await product.save();
                    return true; // Trả về true nếu thành công
                } else {
                    console.log(`Không đủ số lượng tồn kho cho size ${size}`);
                    return false; // Trả về false nếu không đủ số lượng tồn kho
                }
            } else {
                console.log(`Không tìm thấy size ${size} trong sản phẩm.`);
                return false; // Trả về false nếu không tìm thấy size
            }
        } else {
            console.log(`Không tìm thấy sản phẩm với ID ${productId}`);
            return false; // Trả về false nếu không tìm thấy sản phẩm
        }
    } catch (error) {
        console.error("Lỗi khi giảm số lượng tồn kho:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};


// Tăng số lượng bán của sản phẩm
const tangSoLuongBan = async (productId, quantity) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        let product = await SanPham.findById(productId);

        // Kiểm tra nếu sản phẩm tồn tại
        if (product) {
            // Tăng số lượng bán của sản phẩm
            product.SoLuongBan += quantity;
            // Lưu sản phẩm sau khi tăng số lượng bán
            await product.save();
            return true; // Trả về true nếu thành công
        } else {
            return false; // Trả về false nếu sản phẩm không tồn tại
        }
    } catch (error) {
        console.error("Lỗi khi tăng số lượng bán:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};

const vnpay = new VNPay({
    tmnCode: process.env.TMNCODE,
    secureSecret: process.env.SECURESECRET,
    vnpayHost: process.env.VNPAYHOST,
    testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
    hashAlgorithm: 'SHA512', // tùy chọn

    /**
     * Sử dụng enableLog để bật/tắt logger
     * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
     */
    enableLog: true, // optional

    /**
     * Hàm `loggerFn` sẽ được gọi để ghi log
     * Mặc định, loggerFn sẽ ghi log ra console
     * Bạn có thể ghi đè loggerFn để ghi log ra nơi khác
     *
     * `ignoreLogger` là một hàm không làm gì cả
     */
    loggerFn: ignoreLogger, // optional
});

module.exports = {

    // get trang checkout
    getPageCheckOut: async (req, res) => {
        let title_page_home = "check-out"
        let userId = req.session.userId    
        console.log("userId:", userId);    
        let checkToken = await TokenKH.findOne({userId: userId}).populate("userId")   

        // hiển thị trên menu navTop
        let loaiSPs = await LoaiSP.find({})
        const menuData = await Promise.all(loaiSPs.map(async (loaiSP) => {
            const hangSXIds = await HangSX.distinct('_id', { IdLoaiSP: loaiSP._id });
            const hangSXs = await HangSX.find({ _id: { $in: hangSXIds } });
            return { loaiSP, hangSXs };
        }));

        let detailCart = await Cart.findOne({MaTKKH: userId}).exec();

        if (!detailCart) {
            res.status(400).json({
                message: "Giỏ hàng không tồn tại",
                success: false
            });
            return;
        }


        let productDetailsArray = []
        let cartItemss = detailCart.cart 

        let tongGiaAllSP = 0;
        // Tính tổng giá của tất cả sản phẩm trong giỏ hàng
        for (const item of cartItemss.items) {
            //const productDetails = await SanPham.findById(item.productId).exec();
            tongGiaAllSP += item.donGia * item.qty;
        }

        const GiamGia = cartItemss.GiamGia;
        console.log("GiamGia cart: ", GiamGia); 

        if (detailCart) {
            const cartItems = detailCart.cart.items;
            
            for (const item of cartItems) {
    
                try {
                    const productDetails = await SanPham.findById(item.productId).populate('IdLoaiSP').populate('IdHangSX').exec();

                    if (productDetails) {
                        const qty = item.qty;
                        const size = item.size;
                        const donGia = item.donGia;
                        const giaChuaGiam = item.giaChuaGiam;

                        // Đẩy chi tiết sản phẩm vào mảng
                        productDetailsArray.push({
                            productDetails, 
                            qty, size, donGia, giaChuaGiam,
                            _id: item._id
                        });
                    } else {
                        console.log("Không tìm thấy chi tiết sản phẩm cho mặt hàng:", item.productId);
                    }
                } catch (error) {
                    console.error("Lỗi khi truy xuất chi tiết sản phẩm:", error);
                }
            }
        } else {
            console.log("Giỏ hàng trống");
            // res.redirect("/get-chi-tiet-cart-url")
        }

        if(checkToken) {          
        
            res.render("TrangChu/Cart/check-out.ejs",{
                title_page_home, menuData,
                user: checkToken.userId.Email,
                ho: checkToken.userId.Ho,
                ten: checkToken.userId.Ten,
                token: checkToken.token,
                rootPath: '/', 
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,                   
                ssIdLoaiSP: req.session.idLoaiSP || "",
                ssIdHangSX: req.session.idHangSX || "",                    
                ssTenSPSearch: req.session.TenSPSearch || "",
                loaiSPSeach: loaiSPs,
                productDetailsArray,
                cartItemss, detailCart,
                tongGiaAllSP, // Truyền tổng giá của tất cả sản phẩm xuống EJS
                GiamGia: cartItemss.GiamGia
            })
        } else {
            res.render("TrangChu/Login/login-register.ejs", {
                title_page_home: "login-register",
                user: "", 
                token: "",                    
                loaiSPSeach: loaiSPs, menuData,
                ssIdLoaiSP: req.session.idLoaiSP || "",
                ssIdHangSX: req.session.idHangSX || "",
                ssTenSPSearch: req.session.TenSPSearch || "",                    
            })
        }
    },

    // xử lý nút đặt hàng
    handleDatHang: async (req, res) => {
        try {
            let Ho = req.body.Ho
            let Ten = req.body.Ten
            let DiaChiChiTiet = req.body.DiaChiChiTiet
            let SoDienThoai = req.body.SoDienThoai
            let Email = req.body.Email
            let Note = req.body.Note
            let TongSLDat = req.body.TongSLDat
            let ThanhTien = req.body.ThanhTien
            let CanThanhToan = req.body.CanThanhToan
            let GiamGia = req.body.GiamGia
            let SoTienGiamGia = req.body.SoTienGiamGia
            let PhiShip = req.body.PhiShip
            let paymentMethodSelected = req.body.paymentMethodSelected
            const customerAccountId = req.session.userId;

            console.log("Ho: ", Ho);
            console.log("Ten: ", Ten);
            console.log("DiaChiChiTiet: ", DiaChiChiTiet);
            console.log("SoDienThoai: ", SoDienThoai);
            console.log("Email: ", Email);
            console.log("Note: ", Note);
            console.log("TongSLDat: ", TongSLDat);
            console.log("ThanhTien: ", ThanhTien);
            console.log("CanThanhToan: ", CanThanhToan);
            console.log("GiamGia: ", GiamGia);
            console.log("SoTienGiamGia: ", SoTienGiamGia);
            console.log("PhiShip: ", PhiShip);
            console.log("paymentMethodSelected: ", paymentMethodSelected);

            // Chuyển đổi từ chuỗi sang số
            const giaTriSo_SoTienGiamGia = parseInt(SoTienGiamGia.replace(/[^0-9]/g, ''));
            const giaTriSo_PhiShip = parseInt(PhiShip.replace(/[^0-9]/g, ''));
            const giaTriSo_CanThanhToan = parseInt(CanThanhToan.replace(/[^0-9]/g, ''));
            const giaTriSo_ThanhTien = parseInt(ThanhTien.replace(/[^0-9]/g, ''));

            console.log("giaTriSo_SoTienGiamGia: ", giaTriSo_SoTienGiamGia);
            console.log("giaTriSo_PhiShip: ", giaTriSo_PhiShip);
            console.log("giaTriSo_CanThanhToan: ", giaTriSo_CanThanhToan);
            console.log("giaTriSo_ThanhTien: ", giaTriSo_ThanhTien);


            //---- GỬI XÁC NHẬN ĐƠN HÀNG VỀ EMAIL
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
                }
            });
            
            const sendOrderConfirmationEmail = async (toEmail) => {
                const mailOptions = {
                    from: 'Khắc Tú',
                    to: toEmail,
                    subject: 'Xác nhận đơn hàng của bạn.',
                    html: `
                            <p style="color: navy; font-size: 20px;">Cảm ơn bạn <span style="color: black; font-weight: bold; font-style: italic;">${Ho} ${Ten} </span>đã đặt hàng!!</p>
                            <p style="color: green; font-style: italic;">Đơn hàng của bạn đã được xác nhận.</p>
                            <p>Tổng số lượng đặt: <span style="color: blue;">${TongSLDat}</span> sản phẩm</p>
                            <p>Tổng tiền của ${TongSLDat} sản phẩm: <span style="color: red;">${ThanhTien}</span></p>
                            <p>Phí giao hàng: <span style="color: red;">${PhiShip}</span></p>
                            <p>Bạn được giảm  ${GiamGia}% cụ thể là: <span style="color: red;">-${SoTienGiamGia}</span></p>
                            <p>Số tiền cần thanh toán: <span style="color: red;">${CanThanhToan}</span></p>
                            <p>Số Điện Thoại Của Bạn ${Ho} ${Ten}: ${SoDienThoai}</p>
                            <p>Địa chỉ nhận hàng: <span style="color: navy; font-style: italic;">${DiaChiChiTiet}</span></p>                            
                            <p>Link Website của tôi: <a href="#">WebShop NA - KT</a></p>
                        `
                };
            
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            resolve();
                        }
                    });
                });
            };

            // --------------------------------------
            // tìm cái giỏ hàng từ thằng customerAccountId trước
            let idGioHang = await Cart.findOne({MaTKKH: customerAccountId})    
            let cartId = idGioHang._id
            // rồi tiếp theo tìm theo _id của cái giỏ hàng đó để thêm vào hóa đơn
            let giohang = await Cart.findById(cartId).populate('cart.items.productId')
            console.log(">>> check giohang:",giohang);

            // chọc tới items để lấy ra tất cả sp trong giỏ hàng để chút nữa map ra thêm vào hóa đđn
            const cartItems = giohang.cart.items

            // Kiểm tra số lượng tồn kho trước khi đặt hàng
            // for (const item of cartItems) {
            //     // try {
            //         const product = await SanPham.findById(item.productId);
            //         if (!product || !product.TenSP || !product.SoLuongTon) {
            //             console.error("Sản phẩm không hợp lệ:", product);
            //             //throw new Error("Sản phẩm không hợp lệ");
            //             return res.status(400).json({ 
            //                 success: false, 
            //                 message: 'Sản phẩm không hợp lệ, có thể do sản phẩm nào đó đã hết hàng. Vui lòng liên hệ lại với admin hoặc đặt sản phẩm khác!' 
            //             });
            //         }

            //         if (product.SoLuongTon < item.qty) {
            //             let sl = `Sản phẩm "${product.TenSP}" chỉ còn ${product.SoLuongTon} sản phẩm, không đủ để đặt hàng. Vui lòng kiểm tra lại giỏ hàng của bạn hoặc liên hệ lại với admin!`;
            //             console.error("Số lượng tồn kho không đủ: ", sl);
            //             // Xử lý lỗi và trả về thông báo cho người dùng
            //             return res.status(400).json({ success: false, message: sl });
            //         }
            //     // } catch (error) {
            //     //     console.error("Lỗi khi kiểm tra sản phẩm:", error);
            //     //     // Xử lý lỗi và trả về thông báo cho người dùng
            //     //     return res.status(400).json({ success: false, message: 'Có lỗi xảy ra khi kiểm tra sản phẩm' });
            //     // }
            // }
            // Kiểm tra số lượng tồn kho trước khi đặt hàng
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

            // khi đặt hàng thì số lượng tồn kho sẽ giảm đi và số lượng bán sẽ tăng lên
            for (const item of cartItems) {
                await giamSoLuongTonKho(item.productId, item.size, item.qty);
                await tangSoLuongBan(item.productId, item.qty);
            } 

            let datHang = await HoaDon.create({
                Ho: Ho,
                Ten: Ten,                
                DiaChiChiTiet: DiaChiChiTiet,
                SoDienThoai: SoDienThoai,
                Email: Email,
                Note: Note,
                PhiShip: giaTriSo_PhiShip,   
                CanThanhToan: giaTriSo_CanThanhToan,
                GiamGia: GiamGia,
                ThanhTien: giaTriSo_ThanhTien,
                SoTienGiamGia: giaTriSo_SoTienGiamGia,
                TongSLDat: TongSLDat,
                MaKH: customerAccountId,
                cart: {
                    items: cartItems.map(item => ({
                        productId: item.productId._id,
                        qty: item.qty,
                        giaChuaGiam: item.giaChuaGiam,
                        size: item.size,
                        donGia: item.donGia,
                    })),                    
                }
            }) 
            

            if(datHang){
                // Gửi email thông báo đặt hàng thành công
                await sendOrderConfirmationEmail(Email);

                // khi login thì sẽ có giỏ hàng khi add, khi dat hang thanh cong, sẽ xóa luôn trong db đi
                await Cart.deleteOne({_id: cartId});
                
                // Nếu có giỏ hàng, xóa giỏ hàng
                req.session.cartId = null;

                let cart = new Cart({
                    cart: {
                        items: [],                        
                    },
                    MaTKKH: customerAccountId,
                });
                await cart.save()

                console.log("newOrder._id.toString(): ", datHang._id.toString());
                // Lấy returnUrl từ frontend gửi lên, nếu không có thì sử dụng mặc định
                const returnUrl = req.body?.returnUrl || 'http://localhost:8075/vnpay_return';
                console.log("newOrder._id.toString(): ", datHang._id.toString());
                
                // Tạo URL thanh toán
                const paymentUrl = vnpay.buildPaymentUrl({
                    vnp_Amount: giaTriSo_CanThanhToan,
                    vnp_IpAddr:
                        req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        req.ip,
                    vnp_TxnRef: datHang._id.toString(),
                    vnp_OrderInfo: `Thanh toan don hang ${datHang._id}`,
                    vnp_OrderType: ProductCode.Other,
                    vnp_ReturnUrl: returnUrl, // Đường dẫn nên là của frontend
                    vnp_Locale: VnpLocale.VN,
                });


                res.status(201).json({ success: true, message: 'Bạn Đã Đặt Hàng Thành Công', paymentUrl, paymentMethodSelected });
                
            }else {
                console.log("dat hang that bai");
                res.status(500).json({ success: false, message: 'Đặt Hàng thất bại' });
            }
        } catch(error) {
            console.error("Lỗi Rồi Cụ:", error);
            res.status(500).json({ success: false, message: 'Đặt Hàng thất bại' });
        }
    }

}