const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const TaiKhoan_KH_Schema = new mongoose.Schema({
    Email: { type: String, minLength: 5, maxLength: 100, unique: true },
    MatKhau: { type: String},
    Ho: { type: String},
    Ten: { type: String},   
    IdMaGiamGiaChoKH: [{ref: "MaGiamGiaChoKH", type: mongoose.SchemaTypes.ObjectId}],
    GiamGia: { type: Number, default: 0 },
    otp: { type: String },  // Thêm trường lưu mã OTP
    otpExpires: { type: Date },  // Thêm trường lưu thời gian hết hạn mã OTP
    isActive: { type: Boolean, default: false }, // Trạng thái tài khoản
},
{ 
    timestamps: true,   // createAt, updateAt
},
)   

TaiKhoan_KH_Schema.plugin(mongoose_delete, { TaiKhoan_KH_Schema: 'all' });

module.exports = mongoose.model("TaiKhoan_KH", TaiKhoan_KH_Schema); 