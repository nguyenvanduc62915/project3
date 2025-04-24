const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ZaloStrategy = require('../config/passport-zalo');

const TaiKhoan_KH = require('../models/TaiKhoan_KH');
require('dotenv').config();

module.exports = (passport) => {
    // passport google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8075/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await TaiKhoan_KH.findOne({ Email: profile.emails[0].value });
            if (!user) {
                user = new TaiKhoan_KH({
                    Email: profile.emails[0].value,
                    Ho: profile.name.familyName,
                    Ten: profile.name.givenName
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

    // passport facebook
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8075/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await TaiKhoan_KH.findOne({ Email: profile.emails[0].value });
            if (!user) {
                user = new TaiKhoan_KH({
                    Email: profile.emails[0].value,
                    Ho: profile.name.familyName,
                    Ten: profile.name.givenName
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

    // passport zalo --- chưa dùng đươc
    passport.use(new ZaloStrategy({
        authorizationURL: 'https://oauth.zaloapp.com/v3/auth',
        tokenURL: 'https://oauth.zaloapp.com/v3/access_token',
        clientID: process.env.ZALO_APP_ID,
        clientSecret: process.env.ZALO_APP_SECRET,
        callbackURL: 'http://localhost:8075/auth/zalo/callback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await TaiKhoan_KH.findOne({ email: profile.email });
            if (!user) {
                user = new TaiKhoan_KH({
                    email: profile.email,
                    name: profile.name
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));
    

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await TaiKhoan_KH.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
