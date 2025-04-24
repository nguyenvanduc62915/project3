const HangSX = require('../../models/HangSX');
const LoaiSP = require('../../models/LoaiSP');
const SanPham = require('../../models/SanPham');
const TokenKH = require('../../models/TokenKH');
const FormatPriceAndEditImage = require("../../services/formartTien_EditAnh");

require('rootpath')();

module.exports = {

    // getPageHome
    getPageHome: async (req, res) => {

        let title_page_home = "trang-chu"
        let userId = req.session.userId        
        let checkToken = await TokenKH.findOne({userId: userId}).populate("userId")

        let sanPham = await SanPham.find({}).populate("IdHangSX").populate("IdLoaiSP")
        

        // hiển thị trên menu navTop
        let loaiSP = await LoaiSP.find({})
        const menuData = await Promise.all(loaiSP.map(async (loaiSP) => {
            const hangSXIds = await HangSX.distinct('_id', { IdLoaiSP: loaiSP._id });
            const hangSXs = await HangSX.find({ _id: { $in: hangSXIds } });
            return { loaiSP, hangSXs };
        }));

        // sản phẩm bán chạy (SoLuongBan > 50)
        let spBanChay = await SanPham.find({SoLuongBan: { $gt: 50 }}).populate("IdHangSX").populate("IdLoaiSP")

        

        if(checkToken) {
        
            res.render("TrangChu/pageHome.ejs",{
                title_page_home,
                user: checkToken.userId.Email,
                ho: checkToken.userId.Ho,
                ten: checkToken.userId.Ten,
                token: checkToken.token,
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                sanPham, spBanChay, loaiSP,
                menuData, loaiSPSeach: loaiSP,
                ssIdLoaiSP:  "",
                ssTenSPSearch: "",
                
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

    updateGiamGia: async (req, res) => {
        const { productId } = req.body;
        console.log("productId: ",productId);

        try {
            await SanPham.findByIdAndUpdate(productId, { GiamGiaTheoNgay: 0 });
            res.json({ success: true });
        } catch (error) {
            console.error('Lỗi khi cập nhật GiamGiaTheoNgay:', error);
            res.json({ success: false });
        }
    },

    detail_tai_trang: async (req, res) => {
        try {
            
            const productId = req.body.idDetailTaiTrang;
            console.log("productId: ",productId);

            const productDetails = await SanPham.findById(productId).populate("IdHangSX").populate("IdLoaiSP")
            console.log("productDetails: ",productDetails);
            
            res.json({ dataProductDetail: productDetails});
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    
}