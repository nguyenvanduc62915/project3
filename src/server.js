require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const homeRoutes = require('./routes/homeRoute');
const connection = require('./config/database');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');

// Cấu hình CORS
// app.use(cors({
//     origin: [
//         'https://shopbandodientu-khactu.onrender.com',
//         `http://localhost:${port}` // Thêm localhost cho môi trường phát triển
//     ],
//     // origin: 'https://shopbandodientu-khactu.onrender.com', // Thay thế 'https://yourdomain.com' bằng domain của bạn
//     credentials: true
// }));

// // Chuyển hướng HTTP sang HTTPS
// app.use((req, res, next) => {
//     if (req.headers['x-forwarded-proto'] === 'http') {
//         return res.redirect(`https://${req.headers.host}${req.url}`);
//     }
//     next();
// });

// default options
app.use(fileUpload());
configViewEngine(app);

const oneDay = 1000 * 60 * 60 * 24;     // lưu phiên trong 1 ngày
app.use(session({
    genid: function(req) {
        // return new Date().getTime()
        return uuidv4(); // Sử dụng UUID v4 để sinh giá trị duy nhất cho phiên
    },
    secret: 'secret-key',  // Chuỗi bí mật để mã hóa phiên
    saveUninitialized: true,
    cookie: { 
        maxAge: oneDay, 
    },     // đặt thời gian hết hạn của cookie
    resave: true  
}));
app.use(cookieParser());

  
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// Cấu hình Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// khai bao route
app.use('/', homeRoutes);


// -------  đoạn này là config chạy đẩy hosting lên domain
// connection()
// app.listen(port, () => {
//     console.log(`App listening on port ${port}`);
//     console.log(`ĐÃ CHẠY ...   >>>  http://localhost:${port}`)
//   });


// ------- đoạn dưới là connect db làm như bthg khi chạy docker
(async () => {
    try {
        // using mongoose
        await connection()
        app.listen(port, hostname, () => {
            console.log(`http://localhost:${port}`)
        })
    } catch(error) {
        console.log(">>> LỖI RỒI CỤ: ", error);
    }  
})();