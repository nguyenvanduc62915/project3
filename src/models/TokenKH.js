const mongoose = require('mongoose');

const tokenKHSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  sid: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaiKhoan_KH',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h' // Tự động xóa token sau 1 giờ
  }
});

const TokenKH = mongoose.model('TokenKH', tokenKHSchema);

module.exports = TokenKH;
