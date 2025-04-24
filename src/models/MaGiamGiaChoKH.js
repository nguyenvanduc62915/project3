const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');
const TaiKhoan_KH = require("./TaiKhoan_KH");

const MaGiamGiaChoKH = new mongoose.Schema({
    
    MaGiamGia: { type: String},   
    GiamGiaTheoDonHang: { type: Number, default: 0 },
    DieuKienGiamGia: { type: String},   
},
{ 
    timestamps: true,   // createAt, updateAt
},
)   

// Middleware để cập nhật các tài khoản khách hàng khi voucher bị xóa
MaGiamGiaChoKH.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await TaiKhoan_KH.updateMany(
            { IdMaGiamGiaChoKH: doc._id },
            // { $set: { IdMaGiamGiaChoKH: null } }
            { $pull: { IdMaGiamGiaChoKH: doc._id } }
        );
    }
});
// MaGiamGiaChoKH.plugin(mongoose_delete, { MaGiamGiaChoKH: 'all' });

module.exports = mongoose.model("MaGiamGiaChoKH", MaGiamGiaChoKH); 