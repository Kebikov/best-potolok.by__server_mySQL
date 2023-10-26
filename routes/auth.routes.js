const express = require('express');
const router = express.Router({mergeParams: true});
const bcrypt = require('bcryptjs');
const chalk = require('chalk');
const {pool, promisePool, isArrayEmpty} = require('../helpers/pool');


const TokenService = require('../service/token.service');


//= вход по логину и паролю 
router.post('/login-admin', async (req, res) => {
    try {

        const {email, password} = req.body;

        if(email && password) {
            const [admin] = await promisePool.query(`SELECT * FROM user WHERE email = '${email}' LIMIT 1`);

            if(isArrayEmpty(admin)) return res.status(400).send({ error: { message: 'EMAIL_NOT_FOUND' } });

            const adminId = admin[0].id + '';
            
            const isPasswordEqual = await bcrypt.compare(password, admin[0].password); 
            if(!isPasswordEqual) return res.status(400).send({ error: { message: 'INVALID_PASSWORD' } });
            
            const tokens = TokenService.generate({id: adminId});
            await TokenService.saveTokenInDB(admin[0].id, tokens.refreshToken);
            
            return res.status(200).send({...tokens, userId: adminId, access: 'Admin'});
        } else {
            return res.status(400).send({ error: { message: 'NOT_ALL_DATA_SENT' } }); 
        }

    }catch (err) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`});
    }
});


//= обновление токена 
router.patch('/refresh-token-check', async (req, res) => {
    try {
        const body = req.body;
        // body = {
        //     refreshToken: 'some_token',
        //     id: 'user_id'
        // }
        console.log(body);
        const isMatch = TokenService.validateRefreshToken(body.refreshToken);
        console.log(isMatch);
        if(isMatch && isMatch.id === body.id) {
            const tokens = TokenService.generate({id: body.id});

            await TokenService.saveTokenInDB(body.id, tokens.refreshToken);
            console.log(chalk.bgCyanBright('TOKEN_UPDATE'));

            return res.status(200).send({...tokens, expiresIn: tokens.expiresIn + '', userId: body.id + '', access: 'Admin'});
        } else {
            console.log(chalk.bgCyanBright(' REFRESH_TOKEN_IS_BED '));
            return res.status(400).json( {error: {message: 'REFRESH_TOKEN_IS_BED'}} );
        }

    }catch (err) { 
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`});
    }
});



module.exports = router;