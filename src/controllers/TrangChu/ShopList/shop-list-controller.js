const HangSX = require('../../../models/HangSX');
const LoaiSP = require('../../../models/LoaiSP');
const SanPham = require('../../../models/SanPham');
const TokenKH = require('../../../models/TokenKH');
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");

require('rootpath')();

module.exports = {

    shopListCategoryProduct: async (req, res) => {

        let title_page_home = "shop-list"
        let userId = req.session.userId        
        let checkToken = await TokenKH.findOne({userId: userId}).populate("userId")
        let idLoaiSP = req.query.idLoaiSP
        let idHangSX = req.query.idHangSX
        let min = req.query.min || '10000'
        let max = req.query.max || '500000000'
        let TenSPSearch = req.query.TenSPSearch

        req.session.idLoaiSP = idLoaiSP;
        req.session.idHangSX = idHangSX;
        req.session.min = min;
        req.session.max = max;        
        req.session.TenSPSearch = TenSPSearch;        

        
        let loaiSP = await LoaiSP.findOne({_id: idLoaiSP})
        let hangSP = await HangSX.find({ IdLoaiSP: idLoaiSP }).populate("IdLoaiSP")
        

        // hiển thị trên menu navTop
        let loaiSPs = await LoaiSP.find({})
        const menuData = await Promise.all(loaiSPs.map(async (loaiSP) => {
            const hangSXIds = await HangSX.distinct('_id', { IdLoaiSP: loaiSP._id });
            const hangSXs = await HangSX.find({ _id: { $in: hangSXIds } });
            return { loaiSP, hangSXs };
        }));

        let query = {};
        if (idLoaiSP) {
            query.IdLoaiSP = idLoaiSP;
        }
        if (idHangSX) {
            query.IdHangSX = idHangSX;
        }

        // lọc theo giá bán của sizeQuantity[0] đầu tiên của sp
        if (req.session.min && req.session.max) {
            let giatri1 = parseFloat(req.session.min);
            let giatri2 = parseFloat(req.session.max);
            console.log("giatri1: ", giatri1);
            console.log("giatri2: ", giatri2);

            query.GiaBan = {
                $gte: giatri1,
                $lte: giatri2
            };
        }

        // tìm kiếm sản phẩm theo tên sp
        if (TenSPSearch) {
            query.TenSP = { $regex: new RegExp(TenSPSearch, 'i') };
        }

        // sắp xếp sản phẩm theo giá
        let sortOption = {};
        let SapXepTheoGia = 0; // Mặc định là không sắp xếp 
        if (req.query.SapXepTheoGia) {
            SapXepTheoGia = parseInt(req.query.SapXepTheoGia);
        }
        req.session.SapXepTheoGia = SapXepTheoGia;
    
        if (SapXepTheoGia === 1) {
            sortOption = { GiaBan: 1 }; // Sắp xếp theo giá tăng dần
        } else if (SapXepTheoGia === -1) {
            sortOption = { GiaBan: -1 }; // Sắp xếp theo giá giảm dần
        }

        // Tính toán số lượng sản phẩm cho từng khoảng giá
        const priceRanges = [
            { min: 10000, max: 500000, label: "Dưới 500K" },
            { min: 500000, max: 5000000, label: "500K Đến 5 Triệu" },
            { min: 5000000, max: 10000000, label: "5 Triệu Đến 10 Triệu" },
            { min: 10000000, max: 20000000, label: "10 Triệu Đến 20 Triệu" },
            { min: 20000000, max: 500000000, label: "Trên 20 Triệu" },
        ];

        let counts = await Promise.all(priceRanges.map(async range => {
            let count = await SanPham.countDocuments({
                ...query,
                GiaBan: {
                    $gte: range.min,
                    $lte: range.max
                }
            });
            return {
                label: range.label,
                min: range.min,
                max: range.max,
                count: count
            };
        }));

        let sanPham = await SanPham.find(query).populate("IdHangSX").populate("IdLoaiSP").sort(sortOption);

        // sản phẩm bán chạy (SoLuongBan > 50)
        let spBanChay = await SanPham.find({SoLuongBan: { $gt: 50 }}).populate("IdHangSX").populate("IdLoaiSP")

        if(checkToken) {          
        
            res.render("TrangChu/ShopList/shop-list-category-product.ejs",{
                title_page_home,
                user: checkToken.userId.Email,
                ho: checkToken.userId.Ho,
                ten: checkToken.userId.Ten,
                token: checkToken.token,
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                sanPham, spBanChay, loaiSP, hangSP,
                ssIdLoaiSP: req.session.idLoaiSP || "",
                ssIdHangSX: req.session.idHangSX || "",
                ssMin: req.session.min || "10000",
                ssMax: req.session.max || "500000000", 
                ssTenSPSearch: req.session.TenSPSearch || "",
                counts, 
                menuData, loaiSPSeach: loaiSPs,
                SapXepTheoGiaSession: req.session.SapXepTheoGia || "0",
                
            })
        } else {
            res.render("TrangChu/Login/login-register.ejs", {
                title_page_home: "login-register",
                user: "", 
                token: "",
                menuData,
                ssIdLoaiSP: req.session.idLoaiSP || "",
                ssIdHangSX: req.session.idHangSX || "",
                ssTenSPSearch: req.session.TenSPSearch || "",
                loaiSPSeach: loaiSPs,
                SapXepTheoGiaSession: req.session.SapXepTheoGia || "0"
            })
        } 
    },

    detail_trang_moi: async (req, res) => {
        try {
            let title_page_home = "xem-chi-tiết-sp"
            let userId = req.session.userId        
            let checkToken = await TokenKH.findOne({userId: userId}).populate("userId")                        
    
            // hiển thị trên menu navTop
            let loaiSPs = await LoaiSP.find({})
            const menuData = await Promise.all(loaiSPs.map(async (loaiSP) => {
                const hangSXIds = await HangSX.distinct('_id', { IdLoaiSP: loaiSP._id });
                const hangSXs = await HangSX.find({ _id: { $in: hangSXIds } });
                return { loaiSP, hangSXs };
            }));

            const productId = req.query.idDetailTrangMoi
            console.log("productId: ",productId);

            const productDetails = await SanPham.findById(productId).populate("IdHangSX").populate("IdLoaiSP")
            const spLienQuan = await SanPham.find({IdLoaiSP: productDetails.IdLoaiSP._id}).populate("IdHangSX").populate("IdLoaiSP")
            console.log("productDetails: ",productDetails);
            console.log("spLienQuan: ",spLienQuan);
            

            if(checkToken) {          
        
                res.render("TrangChu/ShopList/detail-product.ejs",{
                    title_page_home,
                    user: checkToken.userId.Email,
                    ho: checkToken.userId.Ho,
                    ten: checkToken.userId.Ten,
                    token: checkToken.token,
                    formatCurrency: FormatPriceAndEditImage.formatCurrency,
                    getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,                   
                    ssIdLoaiSP: req.session.idLoaiSP || "",
                    ssIdHangSX: req.session.idHangSX || "",                    
                    ssTenSPSearch: req.session.TenSPSearch || "",
                    menuData, loaiSPSeach: loaiSPs,
                    sp: productDetails,
                    spLienQuan
                    
                })
            } else {
                res.render("TrangChu/Login/login-register.ejs", {
                    title_page_home: "login-register",
                    user: "", 
                    token: "",
                    menuData,
                    loaiSPSeach: loaiSPs,
                    ssIdLoaiSP: req.session.idLoaiSP || "",
                    ssIdHangSX: req.session.idHangSX || "",
                    ssTenSPSearch: req.session.TenSPSearch || "",                    
                })
            } 
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}