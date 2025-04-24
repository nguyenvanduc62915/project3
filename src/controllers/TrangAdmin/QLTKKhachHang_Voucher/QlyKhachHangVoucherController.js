const {uploadSingleFile, uploadMultipleFiles} = require("../../../services/fileService")
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");
const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');

const moment = require('moment-timezone');
const Token = require("../../../models/Token");
const ChucNang = require("../../../models/ChucNang");
const TaiKhoan_Admin = require("../../../models/TaiKhoan_Admin");
const TaiKhoan_KH = require("../../../models/TaiKhoan_KH");
const PhanQuyen = require("../../../models/PhanQuyen");
const MaGiamGiaChoKH = require("../../../models/MaGiamGiaChoKH");
const LienKetVoucherVaKH = require("../../../models/LienKetVoucherVaKH");
require('rootpath')();
// -------------------------------------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY ');
}
async function KiemTraChucNang(req, idChucNang){    

    let userId = req.session.userId
    let checkToken = await Token.findOne({userId: userId}).populate("userId")

    let count = await PhanQuyen.findOne({
        IdAdminNhanVien: checkToken.userId._id,
        IdChucNang: idChucNang
    });
    console.log("count: ", count);

    if(count){
        console.log("thanh true ");
        return true
    }else {
        console.log("thanh false ");
        return false
    }
}

module.exports = {    

    getPageQLVoucher: async (req, res) => {
        let activee = 'active_quanLyVoucher';
        let activeee = 'active_quanLyVoucher_list';
        let userId = req.session.userId
        let checkToken = await Token.findOne({userId: userId}).populate("userId")

        let SearchKH = req.query.SearchKH;

        req.session.SearchKH = SearchKH;

        console.log("req.session.SearchKH:", req.session.SearchKH);
        console.log("SearchKH:", SearchKH);         
        
        // viết query
        let query = {};
        // tìm kiếm sản phẩm theo tên đăng nhập
        if (SearchKH) {
            query.Email = { $regex: new RegExp(SearchKH, 'i') };
        }

        let kq = await MaGiamGiaChoKH.find({})
        let kh = await TaiKhoan_KH.find(query).populate('IdMaGiamGiaChoKH').exec();
        console.log("kh: ", kh);
        
        const listADWithTime = kh.map(item => ({
            ...item._doc,
            createdAt: convertToVietnamTime(item.createdAt),
            updatedAt: convertToVietnamTime(item.updatedAt),
        }));

        if(checkToken) {
            
            // // phân quyền 
            if(await KiemTraChucNang(req, '66e6fd0ecdee8ccd18f7cb4b') === false){
            
                // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
                return res.render("TrangAdmin/khongCoQuyenTruyCap.ejs", {
                    activee: "khongcoquyen",
                    activeee: "khongcoquyen",
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token,
                                                      
                })
            }
            
            res.render("TrangAdmin/QLTKKhachHang_Voucher/quanLyVoucher.ejs", {                
                user: checkToken.userId.TenDangNhap,
                token: checkToken.token,
                hoten: checkToken.userId.HoTen,
                activee, activeee,                
                ssSearchKH: req.session.SearchKH || "", 
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                listVoucher: kq,
                lishTKKH: listADWithTime,
            })
        } else {
            res.render("TrangAdmin/Login/loginAdmin.ejs", {})
        }        
    },

    createVoucherChoKH: async (req, res) => {

        let IdKH = req.body.IdVoucher;
        let IdMaGiamGiaChoKH = req.body.IdMaGiamGiaChoKH;

        const listVoucherDuocAdd = IdMaGiamGiaChoKH.map(idVoucherKHId => ({
            IdKhachHang: IdKH,
            IdVoucherKH: idVoucherKHId,
        }));

        console.log("IdKH: ",IdKH);
        console.log("idVoucherKH: ",IdMaGiamGiaChoKH);
        console.log("listVoucherDuocAdd: ",listVoucherDuocAdd);
        
        try {            
            // Xóa tất cả các mã giảm giá hiện tại của khách hàng
            await LienKetVoucherVaKH.deleteMany({ IdKhachHang: IdKH });

            // Thêm mới mã giảm giá vào bảng liên kết
            let result = await LienKetVoucherVaKH.insertMany(listVoucherDuocAdd);            
            console.log("Updated  documents: ", result);

            // Cập nhật mô hình TaiKhoan_KH với danh sách mã giảm giá mới
            await TaiKhoan_KH.findByIdAndUpdate(
                IdKH,
                { $set: { IdMaGiamGiaChoKH: IdMaGiamGiaChoKH } },
                { new: true } // Tùy chọn này trả về tài liệu đã cập nhật
            );


            if (result) {
                console.log("result: ", result);
                return res.status(200).json({
                    message: "Thêm mã giảm giá cho tài khoản thành công!",
                    success: true,
                    KQ: 0,
                    data: result
                });
            } else {
                return res.status(404).json({
                    message: "Không tìm thấy bản ghi để cập nhật!",
                    success: false,
                    KQ: -1
                });
            }

        } catch (error) {
            console.error("Error occurred while inserting documents: ", error);
        }
    },

    createVoucher: async (req, res) => {

        let {MaGiamGia, GiamGiaTheoDonHang, DieuKienGiamGia} = req.body

        // Hàm để chuyển đổi giá trị từ định dạng có dấu phân cách thành số nguyên
        function convertToNumber(value) {
            // Loại bỏ tất cả các ký tự không phải số
            let numberString = value.replace(/\./g, ''); // Xóa dấu chấm phân cách hàng nghìn
            // Chuyển đổi chuỗi thành số
            return parseInt(numberString, 10);
        }

        let dieuKienGiamGiaNumber = convertToNumber(DieuKienGiamGia);


        let createVoucher = await MaGiamGiaChoKH.create({
            MaGiamGia: MaGiamGia,
            GiamGiaTheoDonHang: GiamGiaTheoDonHang,
            DieuKienGiamGia: dieuKienGiamGiaNumber,    
        })

        if(createVoucher) {
            return res.status(200).json({
                data: createVoucher,
                success: true,
                message: "Thêm mã giảm giá thành công"
            })
        } else {
            return res.status(500).json({                
                success: false,
                message: "Thêm mã giảm giá thất bại"
            })
        }
    },

    deleteVoucher: async (req, res) => {
        let idXoa = req.params.idXoa;
    
        try {
            const voucher = await MaGiamGiaChoKH.findOneAndDelete({ _id: idXoa });
            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: "Voucher không tìm thấy!"
                });
            }
    
            return res.status(200).json({
                success: true,
                message: "Bạn đã xoá Voucher thành công!"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Xóa Voucher thất bại!",
                error: error.message
            });
        }
    },

    suaVoucher: async (req, res) => {
        let idSua = req.params.idSua
        let {MaGiamGia, GiamGiaTheoDonHang, DieuKienGiamGia} = req.body

        // Hàm để chuyển đổi giá trị từ định dạng có dấu phân cách thành số nguyên
        function convertToNumber(value) {
            // Loại bỏ tất cả các ký tự không phải số
            let numberString = value.replace(/\./g, ''); // Xóa dấu chấm phân cách hàng nghìn
            // Chuyển đổi chuỗi thành số
            return parseInt(numberString, 10);
        }

        let dieuKienGiamGiaNumber = convertToNumber(DieuKienGiamGia);
       
        let check = await MaGiamGiaChoKH.findOne({_id: idSua})
        if( check.MaGiamGia === MaGiamGia &&
            check.GiamGiaTheoDonHang === GiamGiaTheoDonHang &&
            check.DieuKienGiamGia === dieuKienGiamGiaNumber ){
            return res.status(200).json({
                message: "Không có sự thay đổi nào!",
                success: true,
                check: true,
                errCode: 0,
                data: check
            })
        }        

        let update = await MaGiamGiaChoKH.updateOne({_id: idSua},{            
            MaGiamGia: MaGiamGia,
            GiamGiaTheoDonHang: GiamGiaTheoDonHang,
            DieuKienGiamGia: dieuKienGiamGiaNumber,  
        })

        if(update){
            return res.status(200).json({
                message: "Sửa voucher thành công!",
                success: true,
                errCode: 0,
                check: false,
                data: update
            })
        } else {
            return res.status(500).json({
                message: "Lỗi mẹ rồi!",
                success: false,
                errCode: -1,
            })
        }  
    },

    deleteTKKH: async (req, res) => {
        let idXoa = req.params.idXoa;
    
        try {
            const voucher = await TaiKhoan_KH.findOneAndDelete({ _id: idXoa });
            if (!voucher) {
                return res.status(404).json({
                    success: false,
                    message: "Tài khoản khách hàng không tìm thấy!"
                });
            }
    
            return res.status(200).json({
                success: true,
                message: "Bạn đã xoá Tài khoản khách hàng thành công!"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Xóa Tài khoản khách hàng thất bại!",
                error: error.message
            });
        }
    },
}