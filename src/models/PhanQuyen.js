const mongoose_delete = require('mongoose-delete');
const mongoose = require('mongoose');

const PhanQuyen_Schema = new mongoose.Schema({

    IdAdminNhanVien: {ref: "TaiKhoan_Admin", type: mongoose.SchemaTypes.ObjectId},
    IdChucNang: {ref: "ChucNang", type: mongoose.SchemaTypes.ObjectId},
    GhiChu: { type: String}
  
});

// Hook trước khi xóa
// PhanQuyen_Schema.pre('remove', async function(next) {
//     try {
//         // Xóa nhân viên từ bảng TaiKhoan_Admin
//         await mongoose.model('TaiKhoan_Admin').deleteMany({ _id: this.IdAdminNhanVien });


//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// PhanQuyen_Schema.plugin(mongoose_delete, { PhanQuyen_Schema: 'all' });

module.exports = mongoose.model("PhanQuyen", PhanQuyen_Schema);