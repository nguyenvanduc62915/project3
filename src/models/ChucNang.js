const mongoose_delete = require('mongoose-delete');
const mongoose = require('mongoose');

const ChucNang_Schema = new mongoose.Schema({
    
    TenChucNang: { type: String},
    MaChucNang: { type: String}
  
});

ChucNang_Schema.plugin(mongoose_delete, { ChucNang_Schema: 'all' });

module.exports = mongoose.model("ChucNang", ChucNang_Schema);