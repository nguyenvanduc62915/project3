const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');
const HangSX = require('./HangSX');
const LoaiSP = require('./LoaiSP');

const SizeQuantitySchema = new mongoose.Schema({
    size: { type: String, required: false },
    quantity: { type: Number, required: false },
    price: { type: Number, required: false } // Thêm đơn giá
});

const SanPham_Schema = new mongoose.Schema(
    {
        TenSP: { type: String, required: false },
        GiaBan: { type: Number, required: false },
        GiamGiaSP: { type: Number, default: "0" },
        SoNgayKM: { type: String },
        GiamGiaTheoNgay: { type: Number, default: "0" },
        MoTa: { type: String, default: "Not thing" },
        MoTaChiTiet: { type: String, default: "Not thing" },
        // SoLuongTon: { type: Number, required: false, default: "100"  },
        SoLuongBan: { type: Number, required: false, default: "1" },
        SoLuotDanhGia: { type: Number, required: false, default: "1000" },
        Icon: [String],
        // Image1: String,
        // Image2: String,
        // Image3: String,
        IdHangSX: {ref: "HangSX", type: mongoose.SchemaTypes.ObjectId},
        IdLoaiSP: {ref: "LoaiSP", type: mongoose.SchemaTypes.ObjectId},
        sizeQuantity: [SizeQuantitySchema],
        SoLuongTon: { type: Number, required: false, default: 0 },
        KhuyenMaiBatDau: { type: Date, required: false, default: Date.now },
        KhuyenMaiKetThuc: { type: Date, required: false, default: Date.now }
    },
    { 
        timestamps: true,   // createAt, updateAt
    },
);

// Middleware ... tính SoLuongTon = tổng các quantity trong SizeQuantitySchema
SanPham_Schema.pre('save', function(next) {
    const sumQuantity = this.sizeQuantity.reduce((total, sq) => total + sq.quantity, 0);
    this.SoLuongTon = sumQuantity;
    next();
});

// Thêm pre-save hook để tự động cập nhật GiaBan
SanPham_Schema.pre('save', function(next) {
    if (this.sizeQuantity && this.sizeQuantity.length > 0) {
        this.GiaBan = this.sizeQuantity[0].price;
    } else {
        this.GiaBan = 0; // hoặc giá trị mặc định nào đó nếu không có giá trong sizeQuantity
    }
    next();
});

// tự cập nhật lại IdLoaiSP thông qua IdHangSX
SanPham_Schema.pre('save', async function(next) {
    if (this.isModified('IdHangSX') || this.isNew) {
        try {
            const hangSX = await HangSX.findById(this.IdHangSX);
            if (hangSX) {
                this.IdLoaiSP = hangSX.IdLoaiSP; // Gán IdLoaiSP của HangSX vào SanPham
            }
        } catch (error) {
            console.error(error);
        }
    }
    next();
});

// tự động cập nhật lại GiaBan khi price[0] được sửa đổi
SanPham_Schema.post('findOneAndUpdate', async function(doc, next) {
    if (!doc) return next(); // Nếu không có sản phẩm được cập nhật, tiếp tục

    const modifiedFields = this.getUpdate(); // Lấy các trường đã được cập nhật

    if (modifiedFields['$set'] && modifiedFields['$set']['sizeQuantity']) {
        // Nếu có sự thay đổi trong sizeQuantity, cập nhật GiaBan
        const updatedProduct = await SanPham.findById(doc._id);
        if (updatedProduct.sizeQuantity && updatedProduct.sizeQuantity.length > 0) {
            updatedProduct.GiaBan = updatedProduct.sizeQuantity[0].price;
            await updatedProduct.save(); // Lưu lại sản phẩm với GiaBan mới
        }
    }

    next(); // Chuyển điều khiển sang middleware tiếp theo (nếu có)
});

// tự động cập nhật lại IdLoaiSP khi IdHangSX được sửa đổi
SanPham_Schema.post('findOneAndUpdate', async function(doc, next) {
    if (!doc) return next(); // Nếu không có sản phẩm được cập nhật, tiếp tục

    const modifiedFields = this.getUpdate(); // Lấy các trường đã được cập nhật

    if (modifiedFields['$set'] && modifiedFields['$set']['IdHangSX']) {
        // Nếu có sự thay đổi trong IdHangSX, tự động cập nhật lại IdLoaiSP
        try {
            const updatedProduct = await SanPham.findById(doc._id);
            const hangSX = await HangSX.findById(updatedProduct.IdHangSX);
            if (hangSX) {
                updatedProduct.IdLoaiSP = hangSX.IdLoaiSP; // Gán IdLoaiSP của HangSX vào SanPham
                await updatedProduct.save(); // Lưu lại sản phẩm với IdLoaiSP mới
            }
        } catch (error) {
            console.error(error);
        }
    }

    next(); // Chuyển điều khiển sang middleware tiếp theo (nếu có)
});


// Override all methods
SanPham_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

const SanPham = mongoose.model('SanPham', SanPham_Schema);

module.exports = SanPham;