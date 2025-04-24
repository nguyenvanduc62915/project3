const {uploadSingleFile, uploadMultipleFiles} = require("../../../services/fileService")
const LoaiSP = require("../../../models/LoaiSP")
const FormatPriceAndEditImage = require("../../../services/formartTien_EditAnh");
const HangSX = require("../../../models/HangSX");
const mongoose = require('mongoose');
const SanPham = require("../../../models/SanPham");
const Token = require("../../../models/Token");
const PhanQuyen = require("../../../models/PhanQuyen");
const { Types } = mongoose;
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
function convertToObjectId(id) {
    try {
        return mongoose.Types.ObjectId(id);
    } catch (error) {
        console.error("Lỗi khi chuyển đổi id thành ObjectId:", error);
        return null;
    }
}

module.exports = {

    // hiển thị loại sản phẩm
    getTheLoaiNSX: async (req, res) => {

        let activee = 'active_categoris'
        let activeee = 'active_categoris'
        let userId = req.session.userId
        let checkToken = await Token.findOne({userId: userId}).populate("userId")

        let loaiSP = await LoaiSP.find({})
        let hangSX = await HangSX.find({}).populate("IdLoaiSP").exec()
        let showSP = await SanPham.find({}).populate({
            path: 'IdHangSX',
            populate: {
                path: 'IdLoaiSP'
            }
        })
        .populate("IdLoaiSP")

        let groupedProducts  = {}
        // Lặp qua danh sách hãng sản xuất
        hangSX.forEach((hangSXItem) => {
            const tenHangSX = hangSXItem.TenHangSX;
            const _idHang = hangSXItem._id; 
            const loaiSPId = hangSXItem.IdLoaiSP._id.toString()
            const tenLoaiSP = hangSXItem.IdLoaiSP.TenLoaiSP;

            // Kiểm tra xem hãng sản xuất đã được thêm vào danh sách nhóm hay chưa
            if (!groupedProducts[tenHangSX]) {
                // Nếu chưa có, thêm hãng sản xuất vào danh sách nhóm và khởi tạo mảng loại sản phẩm
                groupedProducts[tenHangSX] = {
                    _id: _idHang,
                    loaiSPIds: new Set([loaiSPId]),
                    loaiSPNames: new Set([tenLoaiSP])
                };
            } else {
                // Nếu đã tồn tại, thêm loại sản phẩm vào mảng tương ứng
                groupedProducts[tenHangSX].loaiSPIds.add(loaiSPId);
                groupedProducts[tenHangSX].loaiSPNames.add(tenLoaiSP);
            }
        });

        // Chuyển đổi các Set thành mảng trước khi gửi tới view
        for (const tenHangSX in groupedProducts) {
            groupedProducts[tenHangSX].loaiSPIds = Array.from(groupedProducts[tenHangSX].loaiSPIds);
            groupedProducts[tenHangSX].loaiSPNames = Array.from(groupedProducts[tenHangSX].loaiSPNames);
        }

        // hiển thị kiểu phân loại cho thể loại - check trc khi xoá
        const tongSL = [];
        for (const theloai of loaiSP) {
            const soLuongTenHangSX = await HangSX.countDocuments({ IdLoaiSP: theloai._id });
            tongSL.push({ soLuongTenHangSX, IdLoaiSP: theloai._id });
        }
        
        // hiển thị kiểu phân loại cho hãng sản xuất - check trc khi xoá
        // Khởi tạo mảng để lưu số lượng sản phẩm cho mỗi hãng sản xuất
        let tongSLHangSX = [];
        // Lặp qua danh sách hãng sản xuất để đếm số lượng sản phẩm
        for (const hangSXItem of hangSX) {
            // Đếm số lượng sản phẩm có cùng TenHangSX với hãng sản xuất hiện tại
            // const soLuongSP = showSP.filter(sp => sp.IdHangSX.TenHangSX === hangSXItem.TenHangSX).length;
            const soLuongSP = showSP.filter(sp => sp.IdHangSX && sp.IdHangSX.TenHangSX === hangSXItem.TenHangSX).length;

            
            // Lưu số lượng VÀ Tên hãng sản phẩm vào mảng
            tongSLHangSX.push({ soLuongSP, TenHangSX: hangSXItem.TenHangSX });
        }

        if(checkToken) {
            // phân quyền 
            if(await KiemTraChucNang(req, '65eb07a35d2a4f66ed3852e7') === false){

                // dùng return để dừng việc thực hiện hàm khi điều kiện không đúng
                return res.render("TrangAdmin/khongCoQuyenTruyCap.ejs", {
                    activee: "khongcoquyen",
                    activeee: "khongcoquyen",
                    user: checkToken.userId.TenDangNhap,
                    hoten: checkToken.userId.HoTen,
                    token: checkToken.token                                    
                })
            }

            res.render("TrangAdmin/TheLoai_NSX/theLoaiNSX.ejs", {
                activee, activeee, loaiSP, hangSX: groupedProducts, tongSL, tongSLHangSX,
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

    // tạo các thể loại sản phẩm
    createLoaiSP: async (req, res) => {
        
        let TenLoaiSP = req.body.TenLoaiSP
        let Icon = req.body.Icon
        // console.log("TenLoaiSP: ", TenLoaiSP, "\nIcon: ", Icon);
        let iconUrl = ""

        // kiem tra xem da co file hay chua
        if (!req.files || Object.keys(req.files).length === 0) {
            // khong lam gi
        }
        else {
            let kq = await uploadSingleFile(req.files.Icon)
            iconUrl = kq.path
            console.log(">>> check kq: ", kq.path);
        }

        let checkTenTL = await LoaiSP.findOne({TenLoaiSP: TenLoaiSP})
        if(checkTenTL){
            return res.status(200).json({
                message: "Trùng tên thể loại, Bạn không thể thêm mới!",
                success: true,
                check: true,
                errCode: 0,
            })
        }

        let SP = await LoaiSP.create({
            TenLoaiSP: TenLoaiSP, 
            Icon: iconUrl,             
        })

        if(SP){
            console.log(">>> check kq: ", SP);
            return res.status(200).json({
                message: "Bạn đã thêm loại sản phẩm thành công!",
                success: true,
                errCode: 0,
                check: false,
                data: SP
            })
        } else {
            return res.status(500).json({
                message: "Bạn thêm loại sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }    
    },

    // tạo mới hãng sản xuất
    createHangSX: async (req, res) => {
        
        let TenHangSX = req.body.TenHangSX
        let IdLoaiSP = req.body.IdLoaiSP

        // Tạo đối tượng hangSX
        const hangSX = IdLoaiSP.map(idLoai => ({
            TenHangSX: TenHangSX,
            IdLoaiSP: idLoai
        }))
        console.log("hangSX: ", hangSX);

        let checkTenHangSX = await HangSX.findOne({TenHangSX: TenHangSX})
        if(checkTenHangSX){
            return res.status(500).json({
                message: "Trùng tên Hãng, Bạn không thể thêm mới!",
                success: false,
                check: true,
                errCode: 0,
            })
        }

        try {
            // Chèn nhiều đối tượng vào cơ sở dữ liệu
            let ketQua = await HangSX.insertMany(hangSX);
            console.log("Inserted documents: ", ketQua);

            if(ketQua){
                console.log("ketQua: ", ketQua);
                return res.status(200).json({
                    message: "Bạn đã thêm Hãng sản xuất và liên kết với loại sản phẩm thành công",
                    success: true,
                    check: false,
                    KQ: 0,
                    data: ketQua
                })
            } else {
                return res.status(500).json({
                    message: "Thất bại rồi! Vui lòng thử lại",
                    success: false,   
                    check: false,
                    KQ: -1             
                })
            }  

        } catch (error) {
            console.error("Error occurred while inserting documents: ", error);
        }
    },

    // xoá loại sản phẩm
    deleteLoaiSP: async (req, res) => {

        let idxoa = req.params.idxoa
        console.log("idxoa: ", idxoa)

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaLoaiSP = await LoaiSP.deleteOne({_id: idxoa})

        return res.status(200).json({
            message: "Bạn đã xóa loại sản phẩm thành công!",
            success: true,
            KQ: 0,
            data: xoaLoaiSP
        })
    },

    // xoá hãng sản xuất
    deleteHangSX: async (req, res) => {

        let idxoa = req.params.idxoa
        console.log("idxoa: ", idxoa)

        let xoaHangSX = await HangSX.deleteMany({TenHangSX: idxoa})

        return res.status(200).json({
            message: "Bạn đã xóa loại sản phẩm thành công!",
            success: true,
            KQ: 0,
            data: xoaHangSX
        })
    },

    // sửa loại sản phẩm
    updateLoaiSP: async (req, res) => {

        let idSua = req.params.idSua;
        let TenLoaiSP = req.body.TenLoaiSP;
        let noFileSelectedIcon = req.body.noFileSelectedIcon;
        let iconUrl = ''

        console.log("idSua: ", idSua);
        console.log("TenLoaiSPP: ", TenLoaiSP);
        console.log("noFileSelectedIcon: ", noFileSelectedIcon);

        // kiem tra xem da co file hay chua
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log(">>> khong co file anh nao trong này ");
            // đoạn này là khi client không nhận được ảnh hiện tại của sp cần edit,
            // thì tự gán = giá trị của 1 value hiển thị link ảnh khác
            iconUrl = noFileSelectedIcon       
            console.log(">>>chạy vào đây và gán link file vào iconUrl kết quả bên dưới ");
            console.log(">>>iconUrl: ", iconUrl);
        }
        else {
            // Lặp qua các tệp được tải lên và lưu đường dẫn vào các biến iconUrl
            if (req.files.Iconn) {
                let kq = await uploadSingleFile(req.files.Iconn);
                iconUrl = kq.path;
            }       
        }
        console.log(">>> chạy vào else rồi iconUrl: ", iconUrl);     

        let check = await LoaiSP.findOne({_id: idSua})
        if(check.TenLoaiSP === TenLoaiSP && check.Icon === iconUrl){
            return res.status(200).json({
                message: "Không có sự thay đổi nào!",
                success: true,
                check: true,
                errCode: 0,
                data: check
            })
        }

        let updateLoaiSP = await LoaiSP.findByIdAndUpdate({_id: idSua}, {
            TenLoaiSP: TenLoaiSP,
            Icon: iconUrl
        })

        if(updateLoaiSP){
            console.log(">>> check updateLoaiSP: ", updateLoaiSP);
            return res.status(200).json({
                message: "Bạn đã chỉnh sửa loại sản phẩm thành công!",
                success: true,
                errCode: 0,
                check: false,
                data: updateLoaiSP
            })
        } else {
            return res.status(500).json({
                message: "Bạn chỉnh sửa loại sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }  
    },

    // sửa hãng sản xuất
    // cách 1 là xóa đi xong tạo mới rồi cập nhật lại, gần giống thêm mới
    updateHangSX1: async (req, res) => {

        let idSua = req.params.idSua;
        let SuaTenHangSX = req.body.SuaTenHangSX;
        let SuaIdLoaiSP = req.body['SuaIdLoaiSP[]']; // Đảm bảo rằng bạn sử dụng đúng tên trường

        console.log("idSua: ", idSua);
        console.log("SuaTenHangSX: ", SuaTenHangSX);
        console.log("SuaIdLoaiSP: ", SuaIdLoaiSP);            

        try {
            // Xóa tất cả các mục hiện có với TenHangSX để chuẩn bị cập nhật mới
            await HangSX.deleteMany({ TenHangSX: idSua });
    
            // Lặp qua từng IdLoaiSP và tạo và lưu từng tài liệu mới
            for (let i = 0; i < SuaIdLoaiSP.length; i++) {
                let newHangSX = new HangSX({
                    TenHangSX: SuaTenHangSX,
                    IdLoaiSP: SuaIdLoaiSP[i]
                });
                await newHangSX.save();
            }
    
            res.json({
                success: true,
                check: false,
                message: 'Cập nhật thành công'
            });
        } catch (error) {
            console.error(error);
            res.json({
                success: false,
                message: 'Có lỗi xảy ra'
            });
        }
    },
    // cách 2: cập nhật luôn chứ không xóa đi rồi mới tạo và cập nhật
    updateHangSX: async (req, res) => {
        let idSua = req.params.idSua;
        let SuaTenHangSX = req.body.SuaTenHangSX;
        let SuaIdLoaiSP = req.body['SuaIdLoaiSP[]']; // Đảm bảo rằng bạn sử dụng đúng tên trường
    
        console.log("idSua: ", idSua);
        console.log("SuaTenHangSX: ", SuaTenHangSX);
        console.log("SuaIdLoaiSP: ", SuaIdLoaiSP);            
    
        try {
            // Tìm và cập nhật tất cả các tài liệu có TenHangSX là idSua
            await HangSX.updateMany({ TenHangSX: idSua }, { $set: { TenHangSX: SuaTenHangSX } });
    
            // Xóa tất cả các mục hiện có và thêm mới các tài liệu với IdLoaiSP mới
            // Lặp qua từng IdLoaiSP và tạo và lưu từng tài liệu mới
            for (let i = 0; i < SuaIdLoaiSP.length; i++) {
                let newHangSX = new HangSX({
                    TenHangSX: SuaTenHangSX,
                    IdLoaiSP: SuaIdLoaiSP[i]
                });
                await newHangSX.save();
            }
    
            res.json({
                success: true,
                check: false,
                message: 'Cập nhật thành công'
            });
        } catch (error) {
            console.error(error);
            res.json({
                success: false,
                message: 'Có lỗi xảy ra'
            });
        }
    }
    
}