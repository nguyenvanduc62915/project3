const TaiKhoan_KH = require("../../../models/TaiKhoan_KH")
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

module.exports = {

    // quên mật khẩu - trả mật khẩu về email tài khoản khách hàng
    quenMatKhauKH: async (req, res) => {
        let email_doimk = req.body.email_doimk
        console.log("email đổi mk: ",email_doimk);

        let tk_doimk = await TaiKhoan_KH.findOne({Email: email_doimk})
        if (!tk_doimk) {
            console.log("không tồn tại tài khoản ");
            return res.status(404).json({ success: false,  message: 'Không tồn tại tài khoản! Vui lòng kiểm tra lại email của bạn.' });
        }

        // tạo ra mật khẩu ngẫu nhiên để ném cho người dùng, slice(-6): nó sẽ lấy 6 kí tự cuối cùng từ toString(36)        
        const newPassword = Math.random().toString(36).slice(-6);

        // một chuỗi đã được mã hóa có thể lưu vào cơ sở dữ liệu.
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // lưu lại mật khẩu mới vào db
        tk_doimk.MatKhau = hashedPassword;
        await tk_doimk.save();

        //---- GỬI mật khẩu mới về cho khách hàng
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
        });

        // thông tin của email khách hàng nhận mk mới
        const mailOptions = {
            from: "Admin",
            to: email_doimk,
            subject: 'Yêu cầu lấy lại mật khẩu',
            text: `Mật khẩu mới của bạn là: ${newPassword}`,
            html: `
            <p style="color: green;">Mật khẩu mới của bạn là: ${newPassword}</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Lỗi gửi Email:', error);
                return res.status(500).json({success: false, message: 'Lỗi gửi Email:' });
            }
            console.log('Email sent:', info.response);            
            res.status(200).json({success: true, message: `Mật khẩu mới được gửi tới email của bạn. Vui lòng hãy check Email ${email_doimk} để lấy lại mật khẩu!` });
        });
    },

    // đổi mật khẩu tài khoản khách hàng
    doiMatKhauKH: async (req, res) => {

        let matKhauMoi = req.body.matKhauMoi
        let matKhauCu = req.body.matKhauCu
        let XacNhanMatKhauMoi = req.body.XacNhanMatKhauMoi
        let idKH = req.session.userId

        console.log("matKhauMoi: ",matKhauMoi);
        console.log("matKhauCu: ",matKhauCu);
        console.log("idKH: ",idKH);

        let tk_doimk = await TaiKhoan_KH.findById({_id: idKH})
        let mk = tk_doimk.MatKhau
        if (!tk_doimk) {
            console.log("không tồn tại tài khoản ");
            return res.status(404).json({ success: false,  message: 'Đổi mật khẩu không thành công!' });
        }

        if(matKhauCu != mk){
            console.log("không khớp mật khẩu, mật khẩu cũ sai rồi");
            return res.status(404).json({ success: false,  message: 'Có vẻ bạn đã nhập sai mật khẩu hiện tại?' });
        }

        if(matKhauMoi != XacNhanMatKhauMoi){
            console.log("không khớp mật khẩu:");
            return res.status(404).json({ success: false,  message: 'Có vẻ mật khẩu mới và xác nhận lại không khớp? Vui lòng kiểm tra lại' });
        }

        // lưu lại mật khẩu mới vào db
        tk_doimk.MatKhau = matKhauMoi;
        await tk_doimk.save();

        console.log('tk_doimk:', tk_doimk);            
        res.status(200).json({success: true, message: `Đã đổi mật khẩu không thành công!` });
    }

}