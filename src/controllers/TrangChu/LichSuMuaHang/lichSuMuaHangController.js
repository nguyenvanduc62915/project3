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
const HuyDonHang = require("../../../models/HuyDonHang")
const LienKetVoucherVaKH = require("../../../models/LienKetVoucherVaKH")
require('rootpath')()
require('dotenv').config();

module.exports = {
    home_LichSuMuaHang: async (req, res) => {
        
        let active =''

        // rút gọn mã HD
        function rutGonMa(hexString ) {
            const shortenedHex = hexString.substring(hexString.length - 10);
            return shortenedHex;
        }

        const userId = req.session.userId;
        console.log("userId: ",userId);
        let checkToken = await TokenKH.findOne({userId: userId}).populate("userId")

        let loaiSP = await LoaiSP.find({})
        const menuData = await Promise.all(loaiSP.map(async (loaiSP) => {
            const hangSXIds = await HangSX.distinct('_id', { IdLoaiSP: loaiSP._id });
            const hangSXs = await HangSX.find({ _id: { $in: hangSXIds } });
            return { loaiSP, hangSXs };
        }));

        let soLuongDH = await HoaDon.find({MaKH: userId})
        console.log("tong hoa don: ", soLuongDH.length);
        let tongTienHD = soLuongDH.map(item => item.CanThanhToan || 0).reduce((acc, CanThanhToan) => acc + CanThanhToan, 0);
        console.log("Tổng giá của tất cả hóa đơn: ", tongTienHD);

        let all = await HoaDon.find({MaKH: userId}).populate('cart.items.productId')
        let chuaGiao = await HoaDon.find({MaKH: userId, TinhTrangDonHang: 'Chưa giao hàng'}).populate('cart.items.productId')
        let dangGiao = await HoaDon.find({MaKH: userId, TinhTrangDonHang: 'Đang giao hàng'}).populate('cart.items.productId')
        let daGiao = await HoaDon.find({MaKH: userId, TinhTrangDonHang: 'Đã giao hàng'}).populate('cart.items.productId')
        let daHuy = await HuyDonHang.find({MaKH: userId}).populate('cart.items.productId')
        let maGGKH = await LienKetVoucherVaKH.find({IdKhachHang: userId}).populate('IdKhachHang').populate('IdVoucherKH')
        console.log("maGGKH: ", maGGKH);
        const vouchers = maGGKH.map(item => item.IdVoucherKH);
        console.log("vouchers: ", vouchers);

        if(checkToken) {
        
            res.render("KhachHang/LichSuMuaHang/lich-su-mua-hang.ejs", {
                rootPath: '/' , 
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                rutGonMa,
                title_page_home: "tai-khoan-cua-toi",
                active,
                soLuongDH, tongTienHD, 
                all, chuaGiao, dangGiao, daGiao, daHuy,
                user: checkToken.userId.Email,
                ho: checkToken.userId.Ho,
                ten: checkToken.userId.Ten,
                token: checkToken.token,
                menuData, loaiSPSeach: loaiSP,
                ssIdLoaiSP:  "",
                ssTenSPSearch: "",
                vouchers
            })
        } else {
            res.render("TrangChu/Login/login-register.ejs", {
                title_page_home: "login-register",
                user: "", 
                token: "",
                menuData, loaiSPSeach: loaiSP,
                ssIdLoaiSP:  "",
                ssTenSPSearch: "",
                
            })
        }        
    },

    huyDonHang: async (req, res) => {

        let id_huydonhang = req.params.huydonhang
        console.log("id huy don hang: ",id_huydonhang);

        let timHDCanHuy = await HoaDon.findOne({_id: id_huydonhang})

        let luuHuyHD = await HuyDonHang.create({
            Ho: timHDCanHuy.Ho,
            Ten: timHDCanHuy.Ten,
            ThanhPho: timHDCanHuy.ThanhPho,
            QuanHuyen: timHDCanHuy.QuanHuyen,
            PhuongXa: timHDCanHuy.PhuongXa,
            DiaChiChiTiet: timHDCanHuy.DiaChiChiTiet,
            SoDienThoai: timHDCanHuy.SoDienThoai,
            Email: timHDCanHuy.Email,
            Note: timHDCanHuy.Note,
            PhiShip: timHDCanHuy.PhiShip,
            CanThanhToan: timHDCanHuy.CanThanhToan,
            GiamGia: timHDCanHuy.GiamGia,
            SoTienGiamGia: timHDCanHuy.SoTienGiamGia,
            TinhTrangDonHang: timHDCanHuy.TinhTrangDonHang,
            TinhTrangThanhToan: timHDCanHuy.TinhTrangThanhToan,
            TongSLDat: timHDCanHuy.TongSLDat,            
            MaKH: timHDCanHuy.MaKH,
            cart: timHDCanHuy.cart
        })

        if(luuHuyHD){
            await HoaDon.deleteOne({_id: id_huydonhang});
            // return res.redirect("/order-history")
            res.status(201).json({ success: true, message: 'Hủy Đơn Hàng Thành Công' });
        } else {
            res.status(500).json({ success: false, message: 'Hủy Đơn Hàng thất bại' });
        }
    }

}