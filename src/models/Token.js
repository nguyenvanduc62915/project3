const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
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
    ref: 'TaiKhoan_Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h' // Tự động xóa token sau 1 giờ
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
