const TaiKhoan_Admin = require('../../models/TaiKhoan_Admin');
const Token = require('../../models/Token');

require('rootpath')();

module.exports = {

    // getHomeAdmin
    getHomeAdmin: async (req, res) => {

        let user = req.session.user
        let userId = req.session.userId
        let token = req.session.token
        
        console.log("userId: ",userId);
        let checkToken = await Token.findOne({userId: userId}).populate("userId")
        console.log("checkToken:",checkToken);
        
        if(checkToken) {
            let activee = 'active_homeAdmin'
        
            res.render("TrangAdmin/homeAdmin.ejs", {
                activee, 
                user: checkToken.userId.TenDangNhap,
                hoten: checkToken.userId.HoTen,
                token: checkToken.token
            })
        } else {
            res.render("TrangAdmin/Login/loginAdmin.ejs", {})
        }        
    },
}