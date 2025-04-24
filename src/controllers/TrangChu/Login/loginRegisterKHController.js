const Cart = require('../../../models/Cart');
const HangSX = require('../../../models/HangSX');
const LoaiSP = require('../../../models/LoaiSP');
const TaiKhoan_KH = require('../../../models/TaiKhoan_KH');
const TokenKH = require('../../../models/TokenKH');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('rootpath')();
require('dotenv').config();


function generateRandomToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return token;
}

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = {

    // getLoginRegister
    getLoginRegister: async (req, res) => {
        let userId = req.session.userId        
        let checkToken = await TokenKH.findOne({userId: userId}).populate("userId")
        
        // hiển thị trên menu navTop
        let loaiSP = await LoaiSP.find({})
        // Tạo cấu trúc dữ liệu với loại sản phẩm và các hãng tương ứng
        const menuData = await Promise.all(loaiSP.map(async (loaiSP) => {
            const hangSXIds = await HangSX.distinct('_id', { IdLoaiSP: loaiSP._id });
            const hangSXs = await HangSX.find({ _id: { $in: hangSXIds } });
            return { loaiSP, hangSXs };
        }));

        if(checkToken) {            
        
            res.render("TrangChu/pageHome.ejs", {
                title_page_home: "trang-chu", 
                user: checkToken.userId.Email,
                ho: checkToken.userId.Ho,
                ten: checkToken.userId.Ten,
                token: checkToken.token,
                menuData, loaiSPSeach: loaiSP,
                ssIdLoaiSP:  "",
                ssTenSPSearch: "",
                
            })
        } else {
            res.render("TrangChu/Login/login-register.ejs", {
                title_page_home: "login-register",
                user: "", 
                token: "",
                menuData, loaiSPSeach: loaiSP,
                ssIdLoaiSP:  "",
                ssTenSPSearch: "",
                
            })
        }   
    },

    xactThucOTP: async (req, res) => {
        const { otp, email } = req.body;
    
        try {
            const user = await TaiKhoan_KH.findOne({ Email: email });
    
            if (!user) {
                return res.status(400).json({ success: false, message: "Người dùng không tồn tại!" });
            }
    
            // Kiểm tra mã OTP và thời gian hết hạn
            if (user.otp !== otp) {
                return res.status(400).json({ success: false, message: "Mã OTP không đúng!" });
            }
    
            if (Date.now() > user.otpExpires) {
                return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn!" });
            }
    
            // Nếu OTP hợp lệ, kích hoạt tài khoản
            user.isActive = true;
            user.otp = null;  // Xóa mã OTP sau khi xác thực
            user.otpExpires = null;  // Xóa thời gian hết hạn OTP
            await user.save();
    
            res.status(200).json({ success: true, message: "Xác thực OTP thành công! Bạn có thể đăng nhập." });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }, 

    // Tạo API đăng ký và gửi OTP
    dangKyTKKH: async (req, res) => {
        const { Ho, Ten, EmailDky, PasswordDky, NhapLaiPasswordDky } = req.body;

        try {
            // Kiểm tra xem tên người dùng đã tồn tại trong cơ sở dữ liệu (bao gồm cả tài khoản đã bị xóa)
            let checkUser = await TaiKhoan_KH.findOne({ Email: EmailDky }).exec();

            if (checkUser) {
                // Kiểm tra xem tài khoản có bị xóa không
                if (checkUser.deleted) {
                    // Tài khoản đã bị xóa (xóa mềm), phục hồi tài khoản này
                    await TaiKhoan_KH.restore({ _id: checkUser._id });
                    checkUser = await TaiKhoan_KH.findOne({ Email: EmailDky }); // Lấy lại thông tin tài khoản sau khi phục hồi
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Tồn tại tài khoản!"
                    });
                }
            }

            // Kiểm tra mật khẩu
            if (PasswordDky !== NhapLaiPasswordDky) {
                return res.status(400).json({
                    success: false,
                    message: "Có thể nhập lại mật khẩu không chính xác. Vui lòng thử lại!"
                });
            }

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(PasswordDky, salt);

            // Tạo người dùng mới hoặc cập nhật tài khoản nếu cần
            if (!checkUser) {
                checkUser = new TaiKhoan_KH({
                    Ho: Ho,
                    Ten: Ten,
                    Email: EmailDky,
                    MatKhau: hashedPassword,
                });
            } else {
                checkUser.MatKhau = hashedPassword;  // Cập nhật mật khẩu mới nếu cần
            }

            // Tạo mã OTP ngẫu nhiên
            const otp = crypto.randomInt(100000, 999999);  // Mã OTP có 6 chữ số

            // Lưu OTP và thời gian hết hạn vào cơ sở dữ liệu
            checkUser.otp = otp;
            checkUser.otpExpires = Date.now() + 300000; // Mã OTP có hiệu lực trong 5 phút
            await checkUser.save();

            // Gửi OTP qua email
            const mailOptions = {
                from: 'Khắc Tú',
                to: EmailDky,
                subject: 'Mã OTP Đăng ký tài khoản',
                text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: "Lỗi khi gửi email OTP!"
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Đăng ký tài khoản thành công! Mã OTP đã được gửi đến email của bạn."
                });
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    dangKyTKKH2: async (req, res) => {
        const { Ho, Ten, EmailDky, PasswordDky, NhapLaiPasswordDky } = req.body;
    
        try {
            // Kiểm tra xem tên người dùng đã tồn tại chưa
            const checkUser = await TaiKhoan_KH.findOne({ Email: EmailDky });
    
            if (checkUser) {
                return res.status(400).json({
                    success: false,
                    message: "Tồn tại tài khoản!"
                });
            }
    
            if (PasswordDky !== NhapLaiPasswordDky) {
                return res.status(400).json({
                    success: false,
                    message: "Có thể nhập lại mật khẩu không chính xác. Vui lòng thử lại!"
                });
            }
    
            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);  // Create a salt with 10 rounds
            const hashedPassword = await bcrypt.hash(PasswordDky, salt);  // Hash the password
    
            // Tạo người dùng mới với mật khẩu đã mã hóa
            const newUser = new TaiKhoan_KH({ 
                Ho: Ho, 
                Ten: Ten,
                Email: EmailDky,
                MatKhau: hashedPassword,
            });
    
            await newUser.save();

            // Tạo mã OTP ngẫu nhiên
            const otp = crypto.randomInt(100000, 999999);  // Mã OTP có 6 chữ số

            // Lưu OTP tạm thời vào cơ sở dữ liệu hoặc bộ nhớ (cần phải tạo trường OTP và thời gian hết hạn trong cơ sở dữ liệu)
            newUser.otp = otp;
            newUser.otpExpires = Date.now() + 300000; // Mã OTP có hiệu lực trong 5 phút
            await newUser.save();

            // Gửi OTP qua email
            const mailOptions = {
                from: 'Khắc Tú',
                to: EmailDky,
                subject: 'Mã OTP Đăng ký tài khoản',
                text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
            };

            // Gửi email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: "Lỗi khi gửi email OTP!"
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Đăng ký tài khoản thành công! Mã OTP đã được gửi đến email của bạn.",
                    data: newUser
                });
            });
    
            // res.status(200).json({
            //     success: true,
            //     message: "Đăng ký tài khoản thành công! Bạn đã có thể đăng nhập.",
            //     data: newUser
            // });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },


    loginKH: async (req,res) => {
        let {Email, MatKhau} = req.body
        console.log("Email: ", Email);
        console.log("MatKhau: ", MatKhau);
        const token = generateRandomToken(32); // Lưu giá trị token vào biến        
        console.log("token: ", token);

        try {
            let user = await TaiKhoan_KH.findOne({ Email: Email, deleted: false });
            if (!user) {
                console.log("Sai tài khoản hoặc mật khẩu");
                return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
            }

            if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra mã OTP."
                });
            }
            
            // so sánh mật khẩu user nhập vào và mật khẩu được hash lưu trong db
            const isMatch =  bcrypt.compare(MatKhau, user.MatKhau);
            console.log(" isMatch: ",isMatch);

            if (!isMatch) {
                console.log("Sai tài khoản hoặc mật khẩu");
                return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
            }
    
            let checkToken = await TokenKH.findOne({ userId: user._id });
            if (checkToken) {
                // Nếu đã tồn tại token, cập nhật giá trị mới
                checkToken.token = token;
                checkToken.sid = req.sessionID; // Lưu session ID vào token
                await checkToken.save();
            } else {
                // Nếu không tồn tại token, tạo mới
                checkToken = new TokenKH({
                    token: token,
                    userId: user._id,
                    sid: req.sessionID // Lưu session ID vào token
                });
                await checkToken.save();
            }

            if (user) {
                // Nếu đã đăng nhập, kiểm tra xem có giỏ hàng trong database không
                let cart = await Cart.findOne({ 'MaTKKH': user._id });

                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalQuaty: 0,
                        },
                        MaTKKH: user._id,
                    });
                    await cart.save();
                }

                // Đặt thông tin giỏ hàng trong phiên
                req.session.cartId = cart._id;
            }
    
            req.session.user = user;
            req.session.token = token;
            req.session.userId = user._id;
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Cookie tồn tại trong 1 giờ (3600000 ms)
            return res.status(200).json({ success: true, message: 'Đăng nhập thành công. Vui lòng chờ giây lát!' });
        } catch (error) {
            console.log("lỗi cụ rồi: ", error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    dangXuatKH: async (req, res) => {
        // reset GiamGia trong cart = 0 khi đăng xuất tài khoản
        let userId = req.session.userId;
        let detailCart = await Cart.findOne({ MaTKKH: userId }).exec();
        let cartItemss = detailCart?.cart;
        cartItemss.GiamGia = 0; // Cập nhật giá trị GiamGia    
        // Lưu lại giỏ hàng
        await detailCart?.save();

        await TokenKH.deleteOne({userId: req.session.user})
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.clearCookie('connect.sid', { httpOnly: true, secure: true, sameSite: 'strict' });
        req.session.destroy();
        // return res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
        res.redirect('/page-home');
    }
}