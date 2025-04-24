const {uploadSingleFile, uploadMultipleFiles} = require("../../../services/fileService")
const LoaiSP = require("../../../models/LoaiSP")
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");
const HangSX = require("../../../models/HangSX");
const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
const { Types: { ObjectId } } = require('mongoose');

const SanPham = require("../../../models/SanPham");
const PhanQuyen = require("../../../models/PhanQuyen");
const moment = require('moment-timezone');
const Token = require("../../../models/Token");
const json2xls = require("json2xls");
const { htmlToText } = require("html-to-text");
const xlsx = require('xlsx');
require('rootpath')();
// -------------------------------------------------------------------------

// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY HH:mm:ss');
}
// hiển thị ngày và giờ khuyến mại bắt đầu - kết thúc khi vào trang chỉnh sửa sản phẩm
function convertToISODateTime(dateTime) {
    // 'dateTime' có định dạng 'DD-MM-YYYY HH:mm:ss'
    const [date, time] = dateTime.split(' ');
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}T${time}`;
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

    showListSPPhanTrang: (req, res) => { 
        let redirectUrl = '/list-quan-ly-sp';
        const page = req.query.page || '';
        const SapXepTheoGia = req.query.SapXepTheoGia || '';
        const LocTheoGia = req.query.LocTheoGia || '1000-999999999';

        let queryParams = '';
        if (SapXepTheoGia) {
            queryParams += `?SapXepTheoGia=${SapXepTheoGia}`;
        }
        if (LocTheoGia) {
            queryParams += `${queryParams ? '&' : '?'}LocTheoGia=${LocTheoGia}`;
        }
        if (page) {
            queryParams += `${queryParams ? '&' : '?'}page=${page}`;
        }

        redirectUrl += queryParams;
        return res.redirect(redirectUrl);
    },

    showListSP_Search_PhanTrang: (req, res) => { 
        let redirectUrl = '/list-quan-ly-sp';
        const searchSP = req.query.searchSP || '';
        const page = req.query.page || '';
        const SapXepTheoGia = req.query.SapXepTheoGia || '0';
        const LocTheoGia = req.query.LocTheoGia || '1000-999999999';

        let queryParams = '';
        if (searchSP) {
            queryParams += `?searchSP=${searchSP}`;
        }
        if (SapXepTheoGia) {
            queryParams += `${queryParams ? '&' : '?'}SapXepTheoGia=${SapXepTheoGia}`;
        }
        if (LocTheoGia) {
            queryParams += `${queryParams ? '&' : '?'}LocTheoGia=${LocTheoGia}`;
        }
        if (page) {
            queryParams += `${queryParams ? '&' : '?'}page=${page}`;
        }

        redirectUrl += queryParams;
        return res.redirect(redirectUrl);
    },

    showListSP_SearchTheoTheLoai_PhanTrang: (req, res) => { 
        let redirectUrl = '/list-quan-ly-sp';
        const searchSP_TheLoaiSP = req.query.searchSP_TheLoaiSP || '';
        const page = req.query.page || '';
        const SapXepTheoGia = req.query.SapXepTheoGia || '';
        const LocTheoGia = req.query.LocTheoGia || '1000-999999999';

        let queryParams = '';
        if (searchSP_TheLoaiSP) {
            queryParams += `?searchSP_TheLoaiSP=${searchSP_TheLoaiSP}`;
        }
        if (SapXepTheoGia) {
            queryParams += `${queryParams ? '&' : '?'}SapXepTheoGia=${SapXepTheoGia}`;
        }
        if (LocTheoGia) {
            queryParams += `${queryParams ? '&' : '?'}LocTheoGia=${LocTheoGia}`;
        }
        if (page) {
            queryParams += `${queryParams ? '&' : '?'}page=${page}`;
        }

        redirectUrl += queryParams;
        return res.redirect(redirectUrl);
    },

    
    // hiển thị list quản lý sản phẩm
    showListSP: async (req, res) => {        

        let activee = 'active_quanLySP';
        let activeee = 'active_quanLySP';
    
        let searchSP = req.query.searchSP;
        let searchSP_TheLoaiSP = req.query.searchSP_TheLoaiSP;
        let LocTheoGia = req.query.LocTheoGia || '1000-999999999';
    
        req.session.searchSP = searchSP;
        req.session.searchSP_TheLoaiSP = searchSP_TheLoaiSP;
        req.session.LocTheoGia = LocTheoGia;
    
        let theLoai = await LoaiSP.find({});
    
        // phân trang
        let page = 1;
        const limit = 10;
        
        if(req.query.page){
            page = parseInt(req.query.page);
            page = page < 1 ? 1 : page;
        }
        let skip = (page - 1) * limit;
    
        let query = {};
        // tìm kiếm sản phẩm theo tên sp
        if (searchSP) {
            query.TenSP = { $regex: new RegExp(searchSP, 'i') };
        }
        
        // tìm kiếm sp theo thể loại
        if (searchSP_TheLoaiSP) {
            if (mongoose.Types.ObjectId.isValid(searchSP_TheLoaiSP)) {
                query.IdLoaiSP = new mongoose.Types.ObjectId(searchSP_TheLoaiSP);
            }
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
    
        // lọc sản phẩm theo giá từ X đến Y
        console.log("LocTheoGia: ", LocTheoGia);
        let convert_string = LocTheoGia.replace(/[^\d-]/g, '');
        console.log("convert_string: ", convert_string);
    
        req.session.price = convert_string;
        const price = req.session.price;
        
        let valuesArray = price.split('-');
        console.log("valuesArray: ", valuesArray);
        
        let giatri1 = parseFloat(valuesArray[0]);
        let giatri2 = parseFloat(valuesArray[1]);
        console.log("giatri1: ", giatri1);
        console.log("giatri2: ", giatri2);
    
        function formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        function formatRangeString(rangeString) {
            const parts = rangeString.split('-');
            const firstPart = formatNumber(parts[0]);
            const secondPart = formatNumber(parts[1]);
            return `${firstPart} đến ${secondPart}`;
        }
        let formattedNumber = formatRangeString(LocTheoGia);
        console.log("formattedNumber", formattedNumber);
    
        if (convert_string) {
            query.GiaBan = {
                $gte: giatri1,
                $lte: giatri2
            };
        }
    
        console.log('Final Query:', query);
    
        try {
            let userId = req.session.userId
            let checkToken = await Token.findOne({userId: userId}).populate("userId")

            // // phân quyền 
            if(await KiemTraChucNang(req, '65eb076d5d2a4f66ed3852e6') === false){

                // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
                return res.render("TrangAdmin/khongCoQuyenTruyCap.ejs", {
                    activee: "khongcoquyen",
                    activeee: "khongcoquyen",
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token                                    
                })
            }

            if(checkToken) {
                const showSP = await SanPham.find(query)
                    .populate({
                        path: 'IdHangSX',
                        populate: { path: 'IdLoaiSP' }
                    })
                    .populate("IdLoaiSP")
                    .sort(sortOption)
                    .skip(skip)
                    .limit(limit)
                    .exec();
    
                // const showSPWithVietnamTime = showSP.map(item => ({
                //     ...item._doc,
                //     createdAt: convertToVietnamTime(item.createdAt),
                //     updatedAt: convertToVietnamTime(item.updatedAt),
                //     KhuyenMaiBatDau: convertToVietnamTime(item.KhuyenMaiBatDau),
                //     KhuyenMaiKetThuc: convertToVietnamTime(item.KhuyenMaiKetThuc),
                // }));
                const showSPWithVietnamTime = showSP.map(item => {
                    const KhuyenMaiBatDau = convertToVietnamTime(item.KhuyenMaiBatDau);
                    const KhuyenMaiKetThuc = convertToVietnamTime(item.KhuyenMaiKetThuc);
                    
                    return {
                        ...item._doc,
                        createdAt: convertToVietnamTime(item.createdAt),
                        updatedAt: convertToVietnamTime(item.updatedAt),
                        KhuyenMaiBatDauDate: KhuyenMaiBatDau.split(' ')[0],  // lấy phần ngày
                        KhuyenMaiBatDauTime: KhuyenMaiBatDau.split(' ')[1],  // lấy phần giờ
                        KhuyenMaiKetThucDate: KhuyenMaiKetThuc.split(' ')[0],  // lấy phần ngày
                        KhuyenMaiKetThucTime: KhuyenMaiKetThuc.split(' ')[1]   // lấy phần giờ
                    };
                });
        
                const totalProducts = await SanPham.countDocuments(query);
                const numPage = Math.ceil(totalProducts / limit);
        
                console.log('Total Products:', totalProducts);
                console.log('Results:', showSP);
        
                res.render("TrangAdmin/QLSanPham/showListSP.ejs", {
                    activee,
                    activeee,
                    formatCurrency: FormatPriceAndEditImage.formatCurrency,
                    getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                    limit,
                    totalItems: totalProducts,
                    soTrang: numPage,
                    curPage: page,
                    showSP: showSPWithVietnamTime,
                     moment: moment,
                    theLoai,
                    searchSPSession: req.session.searchSP,
                    searchSP_TheLoaiSPSession: req.session.searchSP_TheLoaiSP,
                    SapXepTheoGiaSession: req.session.SapXepTheoGia,
                    LocTheoGiaSession: req.session.LocTheoGia,
                    formattedNumber, 
                    price,
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token
                });
            } else {
                res.render("TrangAdmin/Login/loginAdmin.ejs", {})
            }

            
        } catch (error) {
            console.error('Error:', error);
            // Xử lý lỗi ở đây
        }
    },
    

    // page create sản phẩm
    getCreateSP: async (req, res) => {

        let activee = 'active_quanLySP'
        let activeee = 'active_quanLySPP'
        let userId = req.session.userId
        let checkToken = await Token.findOne({userId: userId}).populate("userId")

        let hangSx = await HangSX.find({}).populate("IdLoaiSP")
        // console.log("hangsx: ", hangSx);

        if(checkToken) {
            // phân quyền 
            if(await KiemTraChucNang(req, '65eb076d5d2a4f66ed3852e6') === false){

                // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
                return res.render("TrangAdmin/khongCoQuyenTruyCap.ejs", {
                    activee: "khongcoquyen",
                    activeee: "khongcoquyen",
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token                                    
                })
            }

            res.render("TrangAdmin/QLSanPham/getCreateSP.ejs", {
                activee, activeee, hangSx, 
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                user: checkToken.userId.TenDangNhap,
                hoten: checkToken.userId.HoTen,
                token: checkToken.token
            })
        } else {
            res.render("TrangAdmin/Login/loginAdmin.ejs", {})
        }        
    },

    // xử lý nút create sản phẩm
    createSanPham: async (req, res) => {
        let imageUrls = [];        

        // Kiểm tra xem có file hay không
        if (req.files && req.files.Icon) {
            // Nếu chỉ có một tệp được tải lên
            if (!Array.isArray(req.files.Icon)) {
                let uploadResult = await uploadSingleFile(req.files.Icon);
                if (uploadResult.status === 'thanh cong') {
                    // Xử lý đường dẫn của tệp được tải lên thành công
                    imageUrls.push(uploadResult.path);
                } else {
                    // Xử lý lỗi khi tải lên tệp
                    return res.status(500).json({
                        message: "Lỗi khi tải lên tệp: " + uploadResult.error,
                        success: false,
                        errCode: -1
                    });
                }
            } else {
                // Nếu có nhiều tệp được tải lên
                let uploadResult = await uploadMultipleFiles(req.files.Icon);
                if (uploadResult.countSuccess > 0) {
                    // Xử lý đường dẫn của các tệp được tải lên thành công
                    imageUrls = uploadResult.detail.filter(file => file.status === 'thanh cong').map(file => file.path);
                } else {
                    // Xử lý lỗi khi tải lên tệp
                    return res.status(500).json({
                        message: "Không có tệp nào được tải lên thành công",
                        success: false,
                        errCode: -1
                    });
                }
            }
        }
        console.log("imageUrls: ", imageUrls);
    

        const formData = req.body;
        // Lấy các giá trị của size, quantity và price từ formData
        const sizes = [];
        for (const key in formData) {
            if (key.startsWith('size')) {
                const index = key.replace('size', '');
                const size = formData[key];
                const quantity = formData[`quantity${index}`];
                let price = formData[`price${index}`];
                // Kiểm tra xem size, quantity và price có giá trị không null hoặc không undefined
                if (size && quantity !== undefined && price !== undefined) {
                    // Chuyển đổi giá thành số
                    const numericPrice = parseInt(price.replace(/\./g, '').replace(' ₫', ''), 10); // Loại bỏ dấu chấm và ₫
                    sizes.push({ size, quantity, price:  numericPrice});
                }
            }
        }
        console.log("sizes: ", sizes);

        let TenSP = req.body.TenSP
        let GiamGiaSP = req.body.GiamGiaSP
        let IdHangSX = req.body.IdHangSX
        let MoTa = req.body.MoTa
        let MoTaChiTiet = req.body.MoTaChiTiet

        const newSanPham = await SanPham.create({     
            TenSP: TenSP,
            GiamGiaSP: GiamGiaSP,
            IdHangSX: IdHangSX,
            MoTa: MoTa,
            MoTaChiTiet: MoTaChiTiet,            
            Icon: imageUrls,
            sizeQuantity: sizes, // Thêm thông tin về size, quantity và price vào sản phẩm

        });
        if(newSanPham){
            console.log(">>> check kq: ", newSanPham);
            // return res.status(200).json({
            //     message: "Bạn đã thêm mới sản phẩm thành công!",
            //     success: true,
            //     errCode: 0,
            //     data: newSanPham
            // })
            return res.redirect("/list-quan-ly-sp")
        } else {
            return res.status(500).json({
                message: "Bạn thêm mới sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }   
    },

    // page update sản phẩm
    getUpdateSP: async (req, res) => {

        let activee = 'active_quanLySP'
        let activeee = 'active_updateSP'
        let idUpdate = req.query.idUpdate
        console.log("idUpdate:", idUpdate);
        let userId = req.session.userId
        let checkToken = await Token.findOne({userId: userId}).populate("userId")

        if(checkToken) {
            // phân quyền 
            if(await KiemTraChucNang(req, '65eb076d5d2a4f66ed3852e6') === false){

                // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
                return res.render("TrangAdmin/khongCoQuyenTruyCap.ejs", {
                    activee: "khongcoquyen",
                    activeee: "khongcoquyen",
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token                                    
                })
            }
            
            let timSP = await SanPham.findOne({_id: idUpdate}).populate({
                path: 'IdHangSX',
                populate: { path: 'IdLoaiSP' }
            })
                .populate("IdLoaiSP")        
                .exec();
            
            const KhuyenMaiBatDau = convertToVietnamTime(timSP.KhuyenMaiBatDau);
            const KhuyenMaiKetThuc = convertToVietnamTime(timSP.KhuyenMaiKetThuc);
            
            const timSPWithTimeVN = {
                ...timSP._doc,
                createdAt: convertToVietnamTime(timSP.createdAt),
                updatedAt: convertToVietnamTime(timSP.updatedAt),
                KhuyenMaiBatDau: convertToISODateTime(KhuyenMaiBatDau), // Chuyển đổi sang định dạng ISO
                KhuyenMaiKetThuc: convertToISODateTime(KhuyenMaiKetThuc), // Chuyển đổi sang định dạng ISO
            };


            let hangSx = await HangSX.find({}).populate("IdLoaiSP")
            console.log("timSP: ", timSP);

            // const sizeQuantitiesJSON = JSON.stringify(timSP.sizeQuantity);
            const sizeQuantitiesJSON = (timSP.sizeQuantity);
            console.log("sizeQuantitiesJSON: ", sizeQuantitiesJSON);

            res.render("TrangAdmin/QLSanPham/getUpdateSP.ejs", {
                activee, activeee, hangSx, 
                timSP: timSPWithTimeVN, 
                sizeQuantitiesJSON,
                formatCurrency: FormatPriceAndEditImage.formatCurrency,
                getRelativeImagePath: FormatPriceAndEditImage.getRelativeImagePath,
                user: checkToken.userId.TenDangNhap,
                hoten: checkToken.userId.HoTen,
                token: checkToken.token
            })
        } else {
            res.render("TrangAdmin/Login/loginAdmin.ejs", {})
        }        
    },

    // xử lý nút update sản phẩm
    updateSanPham: async (req, res) => {
        let id = req.params.idEdit
        console.log(">>> check id: ",id);
        let TenSP = req.body.TenSP
        let GiamGiaSP = req.body.GiamGiaSP
        let KhuyenMaiBatDau = req.body.KhuyenMaiBatDau
        let KhuyenMaiKetThuc = req.body.KhuyenMaiKetThuc
        let GiamGiaTheoNgay = req.body.GiamGiaTheoNgay
        let SoNgayKM = req.body.SoNgayKM
        let IdHangSX = req.body.IdHangSX
        let MoTa = req.body.MoTa
        let MoTaChiTiet = req.body.MoTaChiTiet

        const formData = req.body;
        // Lấy các giá trị của size, quantity và price từ formData
        const sizes = [];
        for (const key in formData) {
            if (key.startsWith('size')) {
                const index = key.replace('size', '');
                const size = formData[key];
                const quantity = formData[`quantity${index}`];
                let price = formData[`price${index}`];
                // Kiểm tra xem size, quantity và price có giá trị không null hoặc không undefined
                if (size && quantity !== undefined && price !== undefined) {
                    // Chuyển đổi giá trị price thành số nguyên
                    price = parseInt(price.replace(/\./g, ''), 10); // Loại bỏ dấu chấm và chuyển đổi thành số
                    sizes.push({ size, quantity, price });
                }
            }
        }
        console.log("sizes: ", sizes);

        let imageUrls = [];        
        // Kiểm tra xem có file hay không
        if (req.files && req.files.Icon) {
            // Nếu chỉ có một tệp được tải lên
            if (!Array.isArray(req.files.Icon)) {
                let uploadResult = await uploadSingleFile(req.files.Icon);
                if (uploadResult.status === 'thanh cong') {
                    // Xử lý đường dẫn của tệp được tải lên thành công
                    imageUrls.push(uploadResult.path);
                } else {
                    // Xử lý lỗi khi tải lên tệp
                    return res.status(500).json({
                        message: "Lỗi khi tải lên tệp: " + uploadResult.error,
                        success: false,
                        errCode: -1
                    });
                }
            } else {
                // Nếu có nhiều tệp được tải lên
                let uploadResult = await uploadMultipleFiles(req.files.Icon);
                if (uploadResult.countSuccess > 0) {
                    // Xử lý đường dẫn của các tệp được tải lên thành công
                    imageUrls = uploadResult.detail.filter(file => file.status === 'thanh cong').map(file => file.path);
                } else {
                    // Xử lý lỗi khi tải lên tệp
                    return res.status(500).json({
                        message: "Không có tệp nào được tải lên thành công",
                        success: false,
                        errCode: -1
                    });
                }
            }
        } else {
            // imageUrls.push(req.body.luuAnh);
            // Tách chuỗi thành mảng các giá trị dựa trên dấu /
            let imageUrlArray = req.body.luuAnh.split('/images/upload/');

            // Loại bỏ phần tử rỗng đầu tiên
            imageUrlArray.shift();

            // Thêm đường dẫn '/images/upload/' vào mỗi phần tử của mảng
            imageUrlArray = imageUrlArray.map(url => '/images/upload/' + url);
            imageUrlArray.forEach(url => {
                imageUrls.push(url);
            });
            console.log("imageUrlArray:",imageUrlArray);
        }
        console.log(">>> imageUrls: ", imageUrls);

        let updateSP = await SanPham.findByIdAndUpdate({_id: id},{
            TenSP: TenSP,
            GiamGiaSP: GiamGiaSP,
            GiamGiaTheoNgay: GiamGiaTheoNgay,
            SoNgayKM: SoNgayKM,
            KhuyenMaiBatDau: KhuyenMaiBatDau,
            KhuyenMaiKetThuc: KhuyenMaiKetThuc,
            IdHangSX: IdHangSX,
            MoTa: MoTa,
            MoTaChiTiet: MoTaChiTiet,            
            Icon: imageUrls,
            sizeQuantity: sizes,
        })
        
        if(updateSP){
            // // Kiểm tra xem giá bán đã được cập nhật tự động hay không
            // const giaBanUpdated = updateSP.isModified('GiaBan');
            // if (giaBanUpdated) {
            //     console.log("Giá bán đã được cập nhật tự động:", updateSP.GiaBan);
            // }
            return res.redirect("/list-quan-ly-sp")
        } else {
            return res.status(500).json({
                message: "Bạn chỉnh sửa sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }  
    },
    
    // xử lý nút xóa sản phẩm
    deleteSanPham: async (req, res) => {
        let idDelete = req.params.idDelete
        console.log("idDelete:",idDelete);

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaSP = await SanPham.delete({_id: idDelete})

        return res.status(200).json({
            message: "Bạn đã xóa sản phẩm thành công!",
            success: true,
            KQ: 0,
            data: xoaSP
        })
    },

    exportProduct: async (req, res) => {
        try {
            // Lấy tất cả sản phẩm, có thể thêm populate nếu cần
            const products = await SanPham.find().populate('IdHangSX IdLoaiSP');
    
            // Chuyển đổi sản phẩm thành định dạng XLS
            const xlsData = [];
    
            products.forEach(product => {
                // Thêm thông tin sản phẩm chính
                const baseData = {
                    'Tên sản phẩm': product.TenSP,
                    'Giá bán': product.GiaBan,
                    'Giảm giá': product.GiamGiaSP,
                    'Số lượng tồn': product.SoLuongTon,
                    'Mô tả': htmlToText(product.MoTa || '', { wordwrap: 130 }), // Chuyển đổi HTML sang text
                    'Mô tả chi tiết': htmlToText(product.MoTaChiTiet || '', { wordwrap: 130 }), // Chuyển đổi HTML sang text
                    'Hãng sản xuất': product.IdHangSX ? product.IdHangSX.TenHangSX : 'Không xác định',
                    'Loại sản phẩm': product.IdLoaiSP ? product.IdLoaiSP.TenLoaiSP : 'Không xác định',
                    'Hình ảnh': product.Icon.join(', '), // Nối các đường dẫn hình ảnh thành chuỗi
                    'Ngày tạo': product.createdAt,
                    'Ngày cập nhật': product.updatedAt,
                };
    
                // Thêm thông tin sizeQuantity
                product.sizeQuantity.forEach(sizeInfo => {
                    // Kết hợp thông tin sizeQuantity với thông tin sản phẩm chính
                    const rowData = { ...baseData };
                    rowData['Kích thước'] = sizeInfo.size;
                    rowData['Số lượng'] = sizeInfo.quantity;
                    rowData['Giá'] = sizeInfo.price;
                    xlsData.push(rowData);
                });
            });
    
            const xls = json2xls(xlsData);
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.set('Content-Disposition', 'attachment; filename="danh_sach_san_pham.xlsx"');
            res.send(Buffer.from(xls, 'binary'));
        } catch (error) {
            console.error("Lỗi xuất sản phẩm:", error);
            res.status(500).send("Có lỗi xảy ra trong quá trình xuất sản phẩm.");
        }
    },

    importProduct: async (req, res) => {
        try {
            console.log("req.file", req.file); // Xem nội dung file nhận được
            console.log("req.body",req.body);  // Xem nội dung body

            const file = req.file;
            if (!file) {
                return res.status(400).json({ success: false, message: 'Không có file nào được tải lên!' });
            }
    
            const workbook = readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet); // Chuyển đổi sheet thành JSON
    
            // Xử lý dữ liệu ở đây
            for (const item of data) {
                const sanPham = new SanPham({
                    TenSP: item.TenSP,
                    GiaBan: item.GiaBan,
                    GiamGiaSP: item.GiamGiaSP,
                    // Thêm các trường khác từ dữ liệu của bạn
                });
                await sanPham.save(); // Lưu sản phẩm vào cơ sở dữ liệu
            }
    
            res.json({ success: true, message: 'Import thành công!', data});
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình import.' });
        }
    }
}