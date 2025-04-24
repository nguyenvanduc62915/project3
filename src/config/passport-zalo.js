const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');

class ZaloStrategy extends OAuth2Strategy {
    constructor(options, verify) {
        super(options, verify);
        this.name = 'zalo';
        this._profileURL = 'https://graph.zalo.me/v2.0/me?fields=id,name,picture,email';
    }

    userProfile(accessToken, done) {
        axios.get(this._profileURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            const profile = response.data;
            profile.provider = 'zalo';
            done(null, profile);
        })
        .catch(error => done(error));
    }
}

module.exports = ZaloStrategy;
