const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const HuyDonHang_Schema = new mongoose.Schema({
  MaKH: { type: mongoose.SchemaTypes.ObjectId, ref: "KhachHang" },
  orderCode: { type: String },
  Ho: { type: String },
  Ten: { type: String },
  ThanhPho: { type: String },
  QuanHuyen: { type: String },
  PhuongXa: { type: String },
  DiaChiChiTiet: { type: String },
  SoDienThoai: { type: String },
  Email: { type: String },
  Note: { type: String },
  PhiShip: { type: Number },
  CanThanhToan: { type: Number, default: 0 },
  GiamGia: { type: Number },
  SoTienGiamGia: { type: Number },
  TongSLDat: { type: Number, default: 0 },
  TinhTrangDonHang: {
    type: String,
    enum: ["Chưa giao hàng", "Đã giao hàng", "Đang giao hàng"],
    default: "Chưa giao hàng",
  },
  TinhTrangThanhToan: {
    type: String,
    enum: ["Đã Thanh Toán", "Chưa Thanh Toán"],
    default: "Chưa Thanh Toán",
  },
  NgayLap: { type: Date, default: Date.now(), immutable: true },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "SanPham",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        donGia: {
          type: Number,
          required: true
        },
        size: { type: String}
      },
    ],
  },
});

HuyDonHang_Schema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("HuyDonHang", HuyDonHang_Schema);
