const jwt = require('jsonwebtoken');
const {pool, promisePool} = require('../helpers/pool');
require('dotenv').config();


class TokenService { 

    accessSecret = process.env.ACCESS_SECRET;
    refreshSecret = process.env.REFRESH_SECRET;
    
    //. generate(генерация токенов) 
    generate(payload) {
        const accessToken = jwt.sign(payload, this.accessSecret, {expiresIn: '1h'});
        const refreshToken = jwt.sign(payload, this.refreshSecret);
        return {accessToken, refreshToken, expiresIn: 3600}
    }
    //. save(сохранение токена в BD) 
    async saveTokenInDB(userId, userType, refreshToken) {
        //const existsUser = await Token.findOne({user: userId});
        const [existsUser] = await promisePool.query(`SELECT * FROM  WHERE id = ${userId} LIMIT 1`);
        if(Array.isArray(existsUser) && existsUser.length === 0) {
            existsUser[0].refreshToken = refreshToken;
            return existsUser.save();
        }

        return token;
    }	
    //. validateRefresh(проверка токена) 
    validateAccessToken(accessToken) {
        try{
            let check = jwt.verify(accessToken,  this.accessSecret);
            if(check?.id) check._id = check.id;
            return check;
        }catch(err) {
            return null; 
        }
    }
    //. validateRefresh(проверка токена) 
    validateRefreshToken(refreshToken) {
        try {
            let check = jwt.verify(refreshToken, this.refreshSecret);
            if(check?.id) check._id = check.id;
            return check;
        } catch(err) {
            return null;
        }
    }
}

module.exports = new TokenService();




