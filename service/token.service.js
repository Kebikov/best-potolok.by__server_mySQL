const jwt = require('jsonwebtoken');
const {promisePool} = require('../helpers/pool');
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
    async saveTokenInDB(userId, refreshToken) {
        try {
            const [updateUser] = await promisePool.query(`UPDATE user SET token = '${refreshToken}' WHERE id = ${userId}`);
            return updateUser;
        }catch (error) {
            console.log('Error in Function saveTokenInDB >>> ', error);
        }
        
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




