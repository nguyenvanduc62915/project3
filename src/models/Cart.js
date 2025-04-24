const mongoose = require('mongoose');
const SanPham = require("./SanPham")
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CartSchema = new Schema({

    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'SanPham',
                required: true
            },
            donGia: {
                type: Number,
                required: true,
                // default: 1
            },
            giaChuaGiam: {
                type: Number,
                required: true,
                // default: 1
            },
            qty: {
                type: Number,
                required: true,
                // default: 1
            },
            size: {
                type: String,               
            }
        }],
        totalQuaty: {
            type: Number,
            default: 0  // Set a default value
        },
        PhiShip: { type: Number, default: 30000 },
        GiamGia: { type: Number, default: 0 },
    },
    MaTKKH: { 
        ref: "TaiKhoan_KH", 
        type: mongoose.SchemaTypes.ObjectId 
    },
    
});

// tự động cập nhật lại khi thay đổi
CartSchema.methods.calculateTotals = function () {
    const cart = this.cart;
  
    // Tính toán tổng giá và tổng số lượng từ mảng items
    const { totalPrice, totalQuaty } = cart.items.reduce(
      (acc, item) => {
        acc.totalQuaty += item.qty;
        return acc;
      },
      { totalPrice: 0, totalQuaty: 0 }
    );
  
    // Cập nhật giá trị mới
    cart.totalQuaty = totalQuaty;
};
  
// Middleware để tự động gọi phương thức calculateTotals trước khi lưu dữ liệu
CartSchema.pre('save', function (next) {
    this.calculateTotals();
    next();
});
  
// CartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('Cart', CartSchema);