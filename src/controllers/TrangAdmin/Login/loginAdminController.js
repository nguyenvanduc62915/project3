const TaiKhoan_Admin = require('../../../models/TaiKhoan_Admin');
const Token = require('../../../models/Token');

require('rootpath')();


function generateRandomToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return token;
}

module.exports = {

    // getLoginAdmin
    getLoginAdmin: async (req, res) => {
        let userId = req.session.userId        
        let checkToken = await Token.findOne({userId: userId}).populate("userId")
        
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

    loginAdmin: async (req,res) => {
        let {TenDangNhap, MatKhau} = req.body
        console.log("TenDangNhap: ", TenDangNhap);
        console.log("MatKhau: ", MatKhau);
        const token = generateRandomToken(32); // Lưu giá trị token vào biến

        console.log("token: ", token);
        try{
            let user = await TaiKhoan_Admin.findOne({TenDangNhap: TenDangNhap, deleted: false})
            if(!user || user.MatKhau !== MatKhau){
                console.log("Sai tài khoản hoặc mật khẩu");
                return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
            } else {
                let checkToken = await Token.findOne({userId: user._id})
                if(checkToken){
                    // Nếu đã tồn tại token, cập nhật giá trị mới
                    checkToken.token = token;
                    checkToken.sid = req.sessionID; // Lưu session ID vào token
                    await checkToken.save();
                } else {
                    // Nếu không tồn tại token, tạo mới
                    checkToken = new Token({
                        token: token,
                        userId: user._id,
                        sid: req.sessionID // Lưu session ID vào token
                    });
                    await checkToken.save();
                }

                req.session.user = user;
                req.session.token = token;
                req.session.userId = user._id
                res.cookie('token', token, { httpOnly: true, maxAge: 36000000 }); // Cookie tồn tại trong 10 giờ (36000000 ms)
                return res.status(200).json({ success: true, message: 'Đăng nhập thành công. Vui lòng chờ giây lát!' });
            }        
        } catch(error){
            console.log("lỗi cụ rồi: ", error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    dangXuatAdmin: async (req, res) => {
        await Token.deleteOne({userId: req.session.user})
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.clearCookie('connect.sid', { httpOnly: true, secure: true, sameSite: 'strict' });
        req.session.destroy();
        // return res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
        res.redirect('/login-admin');
    }
}