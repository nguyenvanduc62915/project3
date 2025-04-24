const express = require('express');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const TokenKH = require('../models/TokenKH');
const TaiKhoan_KH = require('../models/TaiKhoan_KH');
const multipart = require('connect-multiparty');
const fs = require('fs').promises;

const { getHomeAdmin } = require('../controllers/TrangAdmin/homeAdminController');
const { getTheLoaiNSX, createLoaiSP, deleteLoaiSP, updateLoaiSP, createHangSX, deleteHangSX, updateHangSX } = require('../controllers/TrangAdmin/TheLoai_NSX/homeTL_NSXController');
const { showListSP, getCreateSP, createSanPham, getUpdateSP, showListSPPhanTrang, showListSP_Search_PhanTrang, showListSP_SearchTheoTheLoai_PhanTrang, updateSanPham, deleteSanPham, exportProduct, importProduct } = require('../controllers/TrangAdmin/QLSanPham/quanLySanPhamController');
const { getLoginAdmin, loginAdmin, dangXuatAdmin } = require('../controllers/TrangAdmin/Login/loginAdminController');
const { getPageQLAdmin, createTKAdmin, deleteTKAdmin, deleteTokenAdmin, createTKAdminPhanQuyen, suaTaiKhoanDangKhoa, suaTaiKhoanADMIN, getPageQLAdmin_Search_PhanTrang } = require('../controllers/TrangAdmin/QLTKAdmin/quanLyAdmin');
const { getPageHome, updateGiamGia, detail_tai_trang } = require('../controllers/TrangChu/homeController');
const { getLoginRegister, dangKyTKKH, loginKH, dangXuatKH, xactThucOTP } = require('../controllers/TrangChu/Login/loginRegisterKHController');
const { quenMatKhauKH } = require('../controllers/TrangChu/Login/quenMatKhauController');

const router = express.Router();
require('../config/passport')(passport);
const path = require('path');
const { shopListCategoryProduct, detail_trang_moi } = require('../controllers/TrangChu/ShopList/shop-list-controller');
const { addToCart } = require('../controllers/TrangChu/Cart/addToCartController');
const { getCartInfo, getChiTietCart } = require('../controllers/TrangChu/Cart/getCartInfoController');
const { getChiTietCartURL, addVoucher, getCTUpdateSPCart } = require('../controllers/TrangChu/Cart/getChiTietCartController');
const { removeAProductCart } = require('../controllers/TrangChu/Cart/removeAProductCartController');
const { updateAProductCart } = require('../controllers/TrangChu/Cart/updateAProductCartController');
const { getPageCheckOut, handleDatHang } = require('../controllers/TrangChu/Cart/checkOutController');
const { getPageQLVoucher, createVoucher, deleteVoucher, suaVoucher, createVoucherChoKH, deleteTKKH } = require('../controllers/TrangAdmin/QLTKKhachHang_Voucher/QlyKhachHangVoucherController');
const { getTrangQLDonHang, getTrangQLDonHang_ChuaGiao_PhanTrang, DeleteDH, putUpdate_QLDH, doanhThu } = require('../controllers/TrangAdmin/QuanLyDonHang/donHangController');
const { home_LichSuMuaHang, huyDonHang } = require('../controllers/TrangChu/LichSuMuaHang/lichSuMuaHangController');

// ----------------------------------------------------------------
// Helper function to generate random token
function generateRandomToken(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// Routes cho Google OAuth
router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const token = generateRandomToken(32);

        try {
            let checkToken = await TokenKH.findOne({ userId: req.user._id });
            if (checkToken) {
                checkToken.token = token;
                checkToken.sid = req.sessionID;
                await checkToken.save();
            } else {
                checkToken = new TokenKH({
                    token: token,
                    userId: req.user._id,
                    sid: req.sessionID
                });
                await checkToken.save();
            }

            req.session.user = req.user;
            req.session.token = token;
            req.session.userId = req.user._id;
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            res.redirect('/page-home');
        } catch (error) {
            console.error("Error saving token:", error);
            res.status(500).send("Internal server error");
        }
    }
);

// Facebook OAuth routes
router.get('/auth/facebook', 
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/' }),
    async (req, res) => {
        const token = generateRandomToken(32);

        try {
            let checkToken = await TokenKH.findOne({ userId: req.user._id });
            if (checkToken) {
                checkToken.token = token;
                checkToken.sid = req.sessionID;
                await checkToken.save();
            } else {
                checkToken = new TokenKH({
                    token: token,
                    userId: req.user._id,
                    sid: req.sessionID
                });
                await checkToken.save();
            }

            req.session.user = req.user;
            req.session.token = token;
            req.session.userId = req.user._id;
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            res.redirect('/page-home');
        } catch (error) {
            console.error("Error saving token:", error);
            res.status(500).send("Internal server error");
        }
    }
);

// Zalo OAuth routes --- chưa dùng đươc
router.get('/auth/zalo', 
    passport.authenticate('zalo', { scope: ['email'] })
);

router.get('/auth/zalo/callback', 
    passport.authenticate('zalo', { failureRedirect: '/' }),
    async (req, res) => {
        const token = generateRandomToken(32);

        try {
            let checkToken = await TokenKH.findOne({ userId: req.user._id });
            if (checkToken) {
                checkToken.token = token;
                checkToken.sid = req.sessionID;
                await checkToken.save();
            } else {
                checkToken = new TokenKH({
                    token: token,
                    userId: req.user._id,
                    sid: req.sessionID
                });
                await checkToken.save();
            }

            req.session.user = req.user;
            req.session.token = token;
            req.session.userId = req.user._id;
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            res.redirect('/page-home');
        } catch (error) {
            console.error("Error saving token:", error);
            res.status(500).send("Internal server error");
        }
    }
);
// ----------------------------------------------------------------



async function uploadSingleFile(file) {
    // Implement the logic to upload the file here
    // Example logic for uploading the file to a specific directory:
    const uploadPath = path.resolve(__dirname, "../public/images/upload/");
    const fileName = file.name;
    const filePath = `${uploadPath}/${fileName}`;
    await fs.writeFile(filePath, file.data);
    
    // Return the result of the upload operation
    return {
        status: "thanh cong",
        path: filePath,
        error: null
    };
}
router.post('/upload', async (req, res) => {
    try {
        const file = req.files.upload;
        const result = await uploadSingleFile(file);

        if (result.status === "thanh cong") {
            const fileName = path.basename(result.path);
            const url = `/images/upload/${fileName}`;
            const msg = 'Upload thành công!';
            const funcNum = req.query.CKEditorFuncNum;
            console.log({ url, msg, funcNum });
            res.status(201).send(`<script>window.parent.CKEDITOR.tools.callFunction('${funcNum}','${url}','${msg}');</script>`);
        } else {
            console.error("File upload failed:", result.error);
            res.status(500).send('Internal server error');
        }
    } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).send('Internal server error');
    }
});

// Về phía Admin
// trang chủ Admin
router.get("/home-admin", getHomeAdmin)
// trang quản lý thể loại sản phẩm và hãng sản xuất
router.get("/home-the-loai-nsx", getTheLoaiNSX)
// xử lý nút create loại sản phẩm
router.post("/create-loai-sp", createLoaiSP)
// xử lý nút xoá loại sản phẩm
router.delete("/xoa-loaisp/:idxoa", deleteLoaiSP)
// update loại sản phẩm
router.put("/save-loai-sp/:idSua", updateLoaiSP)


// tạo mới hãng sản xuất
router.post("/create-hang-sx", createHangSX)
// xử lý nút xoá hãng sản xuất
router.delete("/xoa-hang-sx/:idxoa", deleteHangSX)
// update hãng sản xuất
router.put("/sua-hang-sx/:idSua", updateHangSX)


// show danh sách quản lý sản phẩm
router.get("/list-quan-ly-sp", showListSP)
// router.get("/list-quan-ly-sp", showListSPPhanTrang)
router.get("/list-quan-ly-sp", async (req, res) => {
    if (req.query.searchSP !== undefined) {
        // Nếu có tham số tìm kiếm được xác định
        if (req.query.searchSP === '') {
            // Nếu tham số tìm kiếm là rỗng, gọi hàm phân trang mà không có tìm kiếm
            return showListSPPhanTrang(req, res);
        } else {
            // Nếu có tham số tìm kiếm, gọi hàm phân trang với tìm kiếm
            return showListSP_Search_PhanTrang(req, res);
        }
    } else if(req.query.searchSP_TheLoaiSP !== undefined) {
        // Nếu có tham số tìm kiếm được xác định
        if (req.query.searchSP_TheLoaiSP === '') {
            // Nếu tham số tìm kiếm là rỗng, gọi hàm phân trang mà không có tìm kiếm
            return showListSPPhanTrang(req, res);
        } else {
            // Nếu có tham số tìm kiếm, gọi hàm phân trang với tìm kiếm
            return showListSP_SearchTheoTheLoai_PhanTrang(req, res);
        }
    } else {
        // Nếu không có tham số tìm kiếm xác định, chuyển hướng về trang phân trang mặc định
        return showListSPPhanTrang(req, res);
    }
});


// page create sản phẩm
router.get("/create-sp", getCreateSP)
// xử lí nút create sản phẩm
router.post("/create-spp", createSanPham)
// page update sản phẩm
router.get("/update-sp", getUpdateSP)
// xử lí nút update sản phẩm
router.post("/update-spp/:idEdit", updateSanPham)
// xử lí nút delete sản phẩm
router.delete("/delete-sp/:idDelete", deleteSanPham)
// export
router.get("/export-product", exportProduct)
const multer = require('multer');
const HoaDon = require('../models/HoaDon');
const upload = multer({ dest: 'uploads/' }); // Thư mục lưu trữ tạm thời
// import
router.post("/import-product", upload.single('file'), importProduct)


// get page login admin
router.get("/login-admin", getLoginAdmin)
// xử lí nút login
router.post("/login-admin", loginAdmin)
// đăng xuất admin
router.get("/logout-admin", dangXuatAdmin)


// quản lý tài khoản admin
// get page list tài khoản admin
router.get("/list-account-admin", getPageQLAdmin)
router.get("/list-account-admin", async (req, res) => {
    if (req.query.searchAD !== undefined) {
        // Nếu có tham số tìm kiếm được xác định
        if (req.query.searchAD === '') {
            // Nếu tham số tìm kiếm là rỗng, gọi hàm phân trang mà không có tìm kiếm
            return getPageQLAdmin_PhanTrang(req, res);
        } else {
            // Nếu có tham số tìm kiếm, gọi hàm phân trang với tìm kiếm
            return getPageQLAdmin_Search_PhanTrang(req, res);
        }
    
    } else {
        // Nếu không có tham số tìm kiếm xác định, chuyển hướng về trang phân trang mặc định
        return getPageQLAdmin_PhanTrang(req, res);
    }
});
// xử lí nút create admin
router.post("/create-tk-admin", createTKAdmin)
// xử lí xoá tài khoản admin
router.delete("/delete-tk-admin/:idXoa", deleteTKAdmin)
// xử lí xoá phiên admin
router.delete("/delete-token-admin/:idXoaToken", deleteTokenAdmin)
// phân quyền cho tài khoản admin
router.post("/create-admin-phan-quyen", createTKAdminPhanQuyen)
// xử lí nút edit tài khoản admin đang khoá
router.put("/save-tk-dang-khoa/:idSua", suaTaiKhoanDangKhoa)
// xử lí nút save tài khoản admin
router.put("/save-tk-admin/:idSua", suaTaiKhoanADMIN)

// quản lý voucher
router.get("/list-voucher", getPageQLVoucher) 
// xử lí nút create voucher
router.post("/create-voucher", createVoucher) 
// xử lí xoá voucher
router.delete("/delete-voucher/:idXoa", deleteVoucher)
// xử lí nút save voucher
router.put("/save-voucher/:idSua", suaVoucher)
// thêm voucher cho kh
router.post("/create-voucher-chokh", createVoucherChoKH) 
// xử lí xoá tài khoản khách hàng
router.delete("/delete-tkkh/:idXoa", deleteTKKH)

// quản lý đơn hàng
router.get("/list-don-hang", getTrangQLDonHang) 
router.get("/list-don-hang", getTrangQLDonHang_ChuaGiao_PhanTrang) 
// Xóa đơn hàng Đã Giao Hàng
router.delete("/delete-HoaDon/:idXoaDH", DeleteDH)
// update đơn hàng
router.put("/save-don-hang/:id_QLDH", putUpdate_QLDH)


// get page home
router.get("/", getPageHome)
router.get("/page-home", getPageHome)
// get Login Register 
router.get("/login-register", getLoginRegister)
// đăng ký tài khoản
router.post("/register-user", dangKyTKKH)
// đăng nhập tài khoản
router.post("/login-user", loginKH)
// đăng xuất tài khoản
router.get("/logout-user", dangXuatKH)
// quên mật khẩu
router.post("/quen-mat-khau", quenMatKhauKH)

// update giảm giá khi kết thúc ngày giảm giá
router.post("/update-giamgia", updateGiamGia)
// xem chi tiết sản phẩm tại trang
router.post("/detailt-sp", detail_tai_trang)
// xem chi tiết link trang mới
router.get("/detailt-sp-linkUrl", detail_trang_moi)

// shop list category product
router.get("/shop-list-category-product", shopListCategoryProduct)

// thêm vào giỏ hàng
router.post("/add-to-cart", addToCart)
// hiển thị tổng số lượng và tổng giá tiền
router.get("/get-info-cart", getCartInfo)
// hiển thị thông tin chi tiết giỏ hàng trên thanh công cụ
router.get("/get-chi-tiet-cart", getChiTietCart)
// xem chi tiết giỏ hàng - url
router.get("/get-chi-tiet-cart-url", getChiTietCartURL)
router.post("/chi-tiet-sp-update-cart", getCTUpdateSPCart)
// add voucher
router.post("/add-voucher", addVoucher)
 // xóa 1 sản phẩm trong giỏ hàng
router.post("/remove-mot-sp/:idARemove", removeAProductCart)
// xử lý nút update 1 sản phẩm trong giỏ hàng
router.put("/update-mot-sp-cart/:idupdateCart", updateAProductCart)
// page checkout
router.get("/check-out-web", getPageCheckOut)
// xử lý nút đặt hàng
router.post("/dat-hang", handleDatHang)

// tài khoản của tôi
router.get("/tai-khoan-cua-toi", home_LichSuMuaHang)
router.delete("/huy-don-hang/:huydonhang", huyDonHang)


router.post("/xac-thuc-otp", xactThucOTP)

router.get("/get-doanh-thu", doanhThu)

router.get('/vnpay_return', async (req, res) => {
    const vnp_TxnRef = req.query.vnp_TxnRef; // Lấy mã giao dịch từ callback
    const vnp_ResponseCode = req.query.vnp_ResponseCode; // Lấy mã phản hồi từ VNPay

    console.log("vnp_TxnRef: ", vnp_TxnRef);
    
    if (vnp_ResponseCode === '00') { // '00' là mã thành công
        // So sánh vnp_TxnRef với _id trong model Order
        const order = await HoaDon.findById(vnp_TxnRef);
        if (order) {
            // Cập nhật trạng thái đơn hàng
            order.TinhTrangThanhToan = 'Đã Thanh Toán';
            await order.save();

            res.send('Thanh toán thành công');
            // res.render('tbThanhToan.ejs');
            // res.status(200).json({
            //     message: 'Thanh toán thành công',
            //     redirectUrl: '/mycart'
            // });
        } else {
            res.status(404).send('Không tìm thấy đơn hàng');
        }
    } else {
        res.send('Thanh toán không thành công, đã đặt đơn nhưng chưa được thanh toán');
        // res.status(400).json({
        //     message: 'Thanh toán không thành công, đã đặt đơn nhưng chưa được thanh toán',
        //     redirectUrl: '/mycart'
        // });
    }
});

// ----------------------------------------------------------------
module.exports = router;