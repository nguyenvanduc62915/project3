const mongoose_delete = require('mongoose-delete');
const mongoose = require('mongoose');

const TaiKhoan_Admin_Schema = new mongoose.Schema({
      TenDangNhap: {
        type: String,

        required: true,
        unique: true,
      },
      MatKhau: { type: String, required: true },
      HoTen: { type: String },
      SDT: { type: String },
      DiaChi: { type: String },
      NgaySinh: { type: Date },
      Note: { type: String },  
  },
  { 
    timestamps: true,   // createAt, updateAt
  },
);

TaiKhoan_Admin_Schema.plugin(mongoose_delete, { TaiKhoan_Admin_Schema: 'all' });

module.exports = mongoose.model("TaiKhoan_Admin", TaiKhoan_Admin_Schema);