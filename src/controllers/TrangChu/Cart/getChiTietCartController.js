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

    // chi tiết cart - url
    getChiTietCartURL: async (req, res) => {
        try{
            let title_page_home = "xem-chi-tiết-giỏ-hàng"
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

            // // KIỂM TRA VÀ ADD VOUCHER
            // let voucher = req.query.voucher || ""
            // console.log("voucher: ",voucher);
           
            // let voucherKH = await TaiKhoan_KH.findOne({_id: userId}).populate("IdMaGiamGiaChoKH")
            // let voucherID = voucherKH.IdMaGiamGiaChoKH            
            // let soTienGiamGia = voucherID.GiamGiaTheoDonHang
            // console.log("voucherID: ",voucherID);
            
            // if(tongGiaAllSP >= voucherID.DieuKienGiamGia){
            //     if(voucherID.MaGiamGia === voucher){
            //         console.log("khớp giảm giá");
                    
            //         cartItemss.GiamGia = soTienGiamGia
    
            //         let kq = await detailCart.save()
            //         if(kq){
            //             res.status(200).json({
            //                 message: `Bạn đã thêm mã giảm giá thành công. Đơn hàng của bạn được giảm thêm ${soTienGiamGia}%`,
            //                 soTienGiamGia: soTienGiamGia,
            //                 success: true
            //             })
            //             // res.redirect("/get-chi-tiet-cart-url")
            //             return
            //         }
            //     } 
            // } else {
            //     console.log(`đơn hàng cần tối thiếu ${voucherID.DieuKienGiamGia}đ để áp dụng mã`);
            //     res.status(200).json({
            //         message: `Đơn hàng cần tối thiếu ${voucherID.DieuKienGiamGia}đ để áp dụng VOUCHER`,
            //         DieuKienGiamGia: voucherID.DieuKienGiamGia,
            //         success: false
            //     })
                
            // }

            // // Kiểm tra và thêm voucher
            // let voucher = req.query.voucher || "";
            // console.log("voucher: ", voucher);

            // if (voucher) {
            //     let voucherKH = await TaiKhoan_KH.findOne({ _id: userId }).populate("IdMaGiamGiaChoKH");
            //     if (voucherKH && voucherKH.IdMaGiamGiaChoKH) {
            //         let voucherID = voucherKH.IdMaGiamGiaChoKH;
            //         let soTienGiamGia = voucherID.GiamGiaTheoDonHang;

            //         if (tongGiaAllSP >= voucherID.DieuKienGiamGia) {
            //             if (voucherID.MaGiamGia === voucher) {
            //                 console.log("khớp giảm giá");
            //                 cartItemss.GiamGia = soTienGiamGia;

            //                 let kq = await detailCart.save();
            //                 if (kq) {
            //                     res.status(200).json({
            //                         message: `Bạn đã thêm mã giảm giá thành công. Đơn hàng của bạn được giảm thêm ${soTienGiamGia}%`,
            //                         soTienGiamGia: soTienGiamGia,
            //                         success: true
            //                     });
            //                     return;
            //                 }
            //             } else {
            //                 console.log("không khớp giảm giá");
            //                 res.status(200).json({
            //                     message: `Mã giảm giá không hợp lệ`,
            //                     success: false
            //                 });
            //                 return;
            //             }
            //         } else {
            //             console.log(`Đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng mã`);
            //             res.status(200).json({
            //                 message: `Đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng VOUCHER`,
            //                 DieuKienGiamGia: voucherID.DieuKienGiamGia,
            //                 success: false
            //             });
            //             return;
            //         }
            //     } else {
            //         console.log("Không tìm thấy thông tin tài khoản hoặc mã giảm giá không hợp lệ");
            //         res.status(200).json({
            //             message: `Không tìm thấy thông tin tài khoản hoặc mã giảm giá không hợp lệ`,
            //             success: false
            //         });
            //         return;
            //     }
            // }
                                    

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
            } 


            if(checkToken) {          
        
                res.render("TrangChu/Cart/chi-tiet-cart-url.ejs",{
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

        }catch(error){
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getCTUpdateSPCart: async (req, res) => {
        try{            

            let userId = req.session.userId    
            console.log("userId:", userId);    
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

                res.status(200).json({
                    data: productDetailsArray,
                    success: true
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "giỏ hàng trống"
                })
                console.log("Giỏ hàng trống");
            } 
            
        }catch(error){
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    addVoucher: async (req, res) => {
        try {
            let userId = req.session.userId;
            let detailCart = await Cart.findOne({ MaTKKH: userId }).exec();
    
            if (!detailCart) {
                res.status(400).json({
                    message: "Giỏ hàng không tồn tại",
                    success: false
                });
                return;
            }
    
            let cartItemss = detailCart.cart;
            let tongGiaAllSP = cartItemss.items.reduce((sum, item) => sum + (item.donGia * item.qty), 0);
    
            let voucher = req.body.voucher || "";
            console.log("voucher: ", voucher);
    
            if (voucher) {
                try {
                    // Lấy khách hàng và populate mã giảm giá
                    let voucherKH = await TaiKhoan_KH.findOne({ _id: userId }).populate("IdMaGiamGiaChoKH");
                    console.log("voucherKH: ", voucherKH);
                    
                    if (voucherKH && voucherKH.IdMaGiamGiaChoKH) {
                        // Tìm mã giảm giá cụ thể từ mảng
                        let voucherID = voucherKH.IdMaGiamGiaChoKH.find(v => v.MaGiamGia === voucher);
            
                        if (voucherID) {
                            let soTienGiamGia = voucherID.GiamGiaTheoDonHang;
                            
                            // Kiểm tra điều kiện giảm giá
                            if (tongGiaAllSP >= voucherID.DieuKienGiamGia) {
                                console.log("khớp giảm giá");
                                cartItemss.GiamGia = soTienGiamGia; // Cập nhật giá trị GiamGia
            
                                // Lưu lại giỏ hàng
                                await detailCart.save();
            
                                res.status(200).json({
                                    message: `Bạn đã thêm mã giảm giá thành công. Đơn hàng của bạn được giảm thêm ${soTienGiamGia}%`,
                                    soTienGiamGia: soTienGiamGia,
                                    success: true
                                });
                                return;
                            } else {
                                console.log(`Đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng mã`);
                                res.status(200).json({
                                    message: `Tổng giá trị đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng VOUCHER`,
                                    DieuKienGiamGia: voucherID.DieuKienGiamGia,
                                    success: false
                                });
                                return;
                            }
                        } else {
                            console.log("Mã giảm giá không hợp lệ");
                            res.status(200).json({
                                message: `Mã giảm giá không hợp lệ`,
                                success: false
                            });
                            return;
                        }
                    } else {
                        console.log("Tài khoản của bạn chưa có mã giảm giá nào hoặc mã giảm giá không hợp lệ");
                        res.status(200).json({
                            message: `Tài khoản của bạn chưa có mã giảm giá nào hoặc mã giảm giá không hợp lệ`,
                            success: false
                        });
                        return;
                    }
                } catch (error) {
                    console.error("Lỗi khi xử lý mã giảm giá: ", error);
                    res.status(500).json({
                        message: "Đã xảy ra lỗi!",
                        success: false
                    });
                }
            }
            
            // if (voucher) {
            //     let voucherKH = await TaiKhoan_KH.findOne({ _id: userId }).populate("IdMaGiamGiaChoKH");
            //     console.log("voucherKH: ",voucherKH);
                
            //     if (voucherKH && voucherKH.IdMaGiamGiaChoKH) {
            //         let voucherID = voucherKH.IdMaGiamGiaChoKH;
            //         let soTienGiamGia = voucherID.GiamGiaTheoDonHang;
    
            //         if (tongGiaAllSP >= voucherID.DieuKienGiamGia) {
            //             if (voucherID.MaGiamGia === voucher) {
            //                 console.log("khớp giảm giá");
            //                 cartItemss.GiamGia = soTienGiamGia; // Cập nhật giá trị GiamGia
    
            //                 // Lưu lại giỏ hàng
            //                 await detailCart.save();
    
            //                 res.status(200).json({
            //                     message: `Bạn đã thêm mã giảm giá thành công. Đơn hàng của bạn được giảm thêm ${soTienGiamGia}%`,
            //                     soTienGiamGia: soTienGiamGia,
            //                     success: true
            //                 });
            //                 return;
            //             } else {
            //                 console.log("không khớp giảm giá");
            //                 res.status(200).json({
            //                     message: `Mã giảm giá không hợp lệ`,
            //                     success: false
            //                 });
            //                 return;
            //             }
            //         } else {
            //             console.log(`Đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng mã`);
            //             res.status(200).json({
            //                 message: `Tổng giá trị đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng VOUCHER`,
            //                 DieuKienGiamGia: voucherID.DieuKienGiamGia,
            //                 success: false
            //             });
            //             return;
            //         }
            //     } else {
            //         console.log("Tài khoản của bạn chưa có mã giảm giá nào hoặc mã giảm giá không hợp lệ");
            //         res.status(200).json({
            //             message: `Tài khoản của bạn chưa có mã giảm giá nào hoặc mã giảm giá không hợp lệ`,
            //             success: false
            //         });
            //         return;
            //     }
            // }
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    addVoucher1: async (req, res) => {

        try {
            let userId = req.session.userId;
            let detailCart = await Cart.findOne({ MaTKKH: userId }).exec();
    
            if (!detailCart) {
                res.status(400).json({
                    message: "Giỏ hàng không tồn tại",
                    success: false
                });
                return;
            }
    
            let cartItemss = detailCart.cart;
            let tongGiaAllSP = cartItemss.items.reduce((sum, item) => sum + (item.donGia * item.qty), 0);
    
            // Kiểm tra và thêm voucher
            let voucher = req.query.voucher || "";
            console.log("voucher: ", voucher);

            if (voucher) {
                let voucherKH = await TaiKhoan_KH.findOne({ _id: userId }).populate("IdMaGiamGiaChoKH");
                if (voucherKH && voucherKH.IdMaGiamGiaChoKH) {
                    let voucherID = voucherKH.IdMaGiamGiaChoKH;
                    let soTienGiamGia = voucherID.GiamGiaTheoDonHang;

                    if (tongGiaAllSP >= voucherID.DieuKienGiamGia) {
                        if (voucherID.MaGiamGia === voucher) {
                            console.log("khớp giảm giá");
                            cartItemss.GiamGia = soTienGiamGia;

                            let kq = await detailCart.save();
                            if (kq) {
                                res.status(200).json({
                                    message: `Bạn đã thêm mã giảm giá thành công. Đơn hàng của bạn được giảm thêm ${soTienGiamGia}%`,
                                    soTienGiamGia: soTienGiamGia,
                                    success: true
                                });
                                return;
                            }
                        } else {
                            console.log("không khớp giảm giá");
                            res.status(200).json({
                                message: `Mã giảm giá không hợp lệ`,
                                success: false
                            });
                            return;
                        }
                    } else {
                        console.log(`Đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng mã`);
                        res.status(200).json({
                            message: `Đơn hàng cần tối thiểu ${FormatPriceAndEditImage.formatCurrency(voucherID.DieuKienGiamGia)} để áp dụng VOUCHER`,
                            DieuKienGiamGia: voucherID.DieuKienGiamGia,
                            success: false
                        });
                        return;
                    }
                } else {
                    console.log("Không tìm thấy thông tin tài khoản hoặc mã giảm giá không hợp lệ");
                    res.status(200).json({
                        message: `Không tìm thấy thông tin tài khoản hoặc mã giảm giá không hợp lệ`,
                        success: false
                    });
                    return;
                }
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}