const mongoose_delete = require('mongoose-delete');
const mongoose = require('mongoose');

const LienKetVoucherVaKH_Schema = new mongoose.Schema({

    IdKhachHang: {ref: "TaiKhoan_KH", type: mongoose.SchemaTypes.ObjectId},
    IdVoucherKH: {ref: "MaGiamGiaChoKH", type: mongoose.SchemaTypes.ObjectId},
  
});


module.exports = mongoose.model("LienKetVoucherVaKH", LienKetVoucherVaKH_Schema);