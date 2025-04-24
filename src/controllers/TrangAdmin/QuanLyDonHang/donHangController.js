const {uploadSingleFile, uploadMultipleFiles} = require("../../../services/fileService")
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");
const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
const { Types: { ObjectId } } = require('mongoose');

const moment = require('moment-timezone');
const Token = require("../../../models/Token");
const PhanQuyen = require("../../../models/PhanQuyen");
const HoaDon = require("../../../models/HoaDon");
const HuyDonHang = require("../../../models/HuyDonHang");
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
    getTrangQLDonHang_ChuaGiao_PhanTrang: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/list-don-hang?page=${req.query.page}`)

        } else if (req.query.page_dangGH){
            return res.redirect(`/list-don-hang?page_dangGH=${req.query.page_dangGH}`)

        } else if (req.query.page_daGH){
            return res.redirect(`/list-don-hang?page_daGH=${req.query.page_daGH}`)

        } else if (req.query.page_DaHuyDH){
            return res.redirect(`/list-don-hang?page_DaHuyDH=${req.query.page_DaHuyDH}`)

        } else {
            res.redirect(`/list-don-hang`)
        }
    },

    getTrangQLDonHang: async (req, res) => {
        var sessions = req.session;
        let activee = 'active_quanLyDonHang';
        let activeee = 'active_quanLyDonHang_list';
        let userId = req.session.userId
        let checkToken = await Token.findOne({userId: userId}).populate("userId")

        // hiển thị đơn hàng khi "Chưa giao hàng"
        let page = 1
        const limit = 2        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }        
        let skip = (page - 1) * limit
        const showHDChuaGiao = await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).skip(skip).limit(limit).populate("cart.items.productId").exec()
        
        let numPage = parseInt((await HoaDon.find({TinhTrangDonHang: "Chưa giao hàng"}).populate("cart.items.productId")).length) / limit
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

        const showHDChuaGiaoWithVietnamTime = showHDChuaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));


        // hiển thị đơn hàng khi "Đang giao hàng"
        let page_dangGH = 1
        const limit_dangGH = 3        
        if(req.query.page_dangGH){
            page_dangGH = req.query.page_dangGH
            page_dangGH = page_dangGH < 1 ? page_dangGH + 1 : page_dangGH
        }        
        let skip_dangGH = (page_dangGH - 1) * limit_dangGH
        const showHDDangGiao = await HoaDon.find({TinhTrangDonHang: "Đang giao hàng", deleted: false}).skip(skip_dangGH).limit(limit_dangGH).populate("cart.items.productId").exec()
        
        let numPage_dangGH = parseInt((await HoaDon.find({TinhTrangDonHang: "Đang giao hàng", deleted: false}).populate("cart.items.productId")).length) / limit_dangGH
        numPage_dangGH = numPage_dangGH - parseInt(numPage_dangGH) === 0 ? numPage_dangGH : numPage_dangGH + 1

        const showHDDangGiaoWithVietnamTime = showHDDangGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));


        // hiển thị đơn hàng khi "Đã giao hàng"
        let page_daGH = 1
        const limit_daGH = 3        
        if(req.query.page_daGH){
            page_daGH = req.query.page_daGH
            page_daGH = page_daGH < 1 ? page_daGH + 1 : page_daGH
        }        
        let skip_daGH = (page_daGH - 1) * limit_daGH
        const showHDDaGiao = await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán", deleted: false}).skip(skip_daGH).limit(limit_daGH).populate("cart.items.productId").exec()
        
        const showHDDaGiaoo = await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán", deleted: false})
        let doanhThu = 0;
        for(tt of showHDDaGiaoo){
            doanhThu += tt.CanThanhToan
        }

        let numPage_daGH = parseInt((await HoaDon.find({TinhTrangDonHang: "Đã giao hàng", TinhTrangThanhToan: "Đã Thanh Toán", deleted: false}).populate("cart.items.productId")).length) / limit_daGH
        numPage_daGH = numPage_daGH - parseInt(numPage_daGH) === 0 ? numPage_daGH : numPage_daGH + 1

        const showHDDaGiaoWithVietnamTime = showHDDaGiao.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));

        // hiển thị đơn hàng khi "Đã hủy đơn hàng"
        let page_DaHuyDH = 1
        const limit_DaHuyDH = 3        
        if(req.query.page_DaHuyDH){
            page_DaHuyDH = req.query.page_DaHuyDH
            page_DaHuyDH = page_DaHuyDH < 1 ? page_DaHuyDH + 1 : page_DaHuyDH
        }        
        let skip_DaHuyDH = (page_DaHuyDH - 1) * limit_DaHuyDH
        const showHDDaHuy = await HuyDonHang.find({ deleted: false}).skip(skip_DaHuyDH).limit(limit_DaHuyDH).populate("cart.items.productId").exec()
        const showHDDaHuyy = await HuyDonHang.find({ deleted: false})

        let numPage_DaHuyDH = parseInt((await HuyDonHang.find({ deleted: false}).populate("cart.items.productId")).length) / limit_DaHuyDH
        numPage_DaHuyDH = numPage_DaHuyDH - parseInt(numPage_DaHuyDH) === 0 ? numPage_DaHuyDH : numPage_DaHuyDH + 1

        const showHDDaHuyWithVietnamTime = showHDDaHuy.map(item => ({
            ...item._doc,
            NgayLap: convertToVietnamTime(item.NgayLap)
        }));

        if(checkToken) {

            // // phân quyền 
            if(await KiemTraChucNang(req, '65fffd9aa8a948b402a806de') === false){
            
                // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
                return res.render("TrangAdmin/khongCoQuyenTruyCap.ejs", {
                    activee: "khongcoquyen",
                    activeee: "khongcoquyen",
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token,
                                                      
                })
            }

            res.render("TrangAdmin/QLDonHang/quanLyDonHang.ejs", {
                soTrang: numPage, curPage: page, 
                soTrang_dangGH: numPage_dangGH, curPage_dangGH: page_dangGH, 
                soTrang_daGH: numPage_daGH, curPage_daGH: page_daGH, 
                soTrang_daHuyDH: numPage_DaHuyDH, curPage_DaHuyDH: page_DaHuyDH, 
                user: checkToken.userId.TenDangNhap,
                token: checkToken.token,
                hoten: checkToken.userId.HoTen,
                rootPath: '/', 
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                showHDChuaGiao: showHDChuaGiaoWithVietnamTime,
                showHDDangGiao: showHDDangGiaoWithVietnamTime,
                showHDDaGiao: showHDDaGiaoWithVietnamTime, doanhThu, showHDDaGiaoo,
                showHDDaHuyDH: showHDDaHuyWithVietnamTime, showHDDaHuyy,
                activee, activeee,   
            })

        } else {
            res.render("TrangAdmin/Login/loginAdmin.ejs", {})
        }
    },

    putUpdate_QLDH: async (req, res) => {

        try {
            let id_QLDH = req.params.id_QLDH
            let TinhTrangDonHang = req.body.TinhTrangDonHang
            let TinhTrangThanhToan = req.body.TinhTrangThanhToan


            let updateDH = await HoaDon.findByIdAndUpdate( {_id: id_QLDH}, {
                TinhTrangDonHang, TinhTrangThanhToan
            })

            console.log("chinh sua updateDH: ", updateDH);
            
            res.status(201).json({ success: true, message: 'Chỉnh sửa đơn hàng thành công' });
            // res.redirect('/list-don-hang'); 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

    DeleteDH: async (req, res) => {
        try{
            let idXoaDH = req.params.idXoaDH

            let deleteDH = await HoaDon.findByIdAndDelete(idXoaDH)

            if (deleteDH) {
                res.status(200).json({success: true, message: 'Xóa đơn hàng thành công.' });

            } else {
                res.status(404).json({success: false, message: 'Xóa Thất bại.' });
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        } 
    },

    doanhThu: async (req, res) => {
        try {
            const orders = await HoaDon.aggregate([
                {
                    $match: {
                        // Lọc các đơn hàng theo điều kiện
                        TinhTrangDonHang: "Đã giao hàng",
                        TinhTrangThanhToan: "Đã Thanh Toán",
                    }
                },
                {
                    $project: {
                        year: { $year: "$NgayLap" },  // Lấy năm từ NgayLap
                        month: { $month: "$NgayLap" }, // Lấy tháng từ NgayLap
                        day: { $dayOfMonth: "$NgayLap" }, // Lấy ngày từ NgayLap
                        totalSales: "$CanThanhToan", // Tổng doanh thu
                        status: 1 
                    }
                },
                {
                    $group: {
                        _id: { year: "$year", month: "$month"}, // Nhóm theo năm, tháng, ngày
                        totalSales: { $sum: "$totalSales" }, // Tổng doanh thu
                        totalOrders: { $sum: 1 } 
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } } // Sắp xếp theo năm, tháng, ngày
            ]);
    
            res.json({ data: orders }); // Trả về dữ liệu doanh thu theo ngày
        } catch (error) {
            res.status(500).send("Error fetching sales data");
        }
    }
}