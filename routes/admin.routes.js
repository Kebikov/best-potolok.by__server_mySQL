const express = require('express');
const router = express.Router({mergeParams: true});
const chalk = require('chalk');
const auth = require('../middleware/auth.middleware');
const {promisePool, isArrayEmpty} = require('../helpers/pool');


//= router.get('/management')
router.get('/management', async (req, res) => {
    try {
        const [management] = await promisePool.query(`SELECT * FROM management`); 

        if(isArrayEmpty(management)) return res.status(200).json( {error: {message: 'OBJECT_NOT_FOUND'}} );
        management[0].cursUsd = management[0].cursUsd + '';
        management[0].isShowBaner = management[0].isShowBaner === 1 ? 'true' : 'false';

        return res.status(200).send(management[0]);
        // management[0] = { 
        //     id: number,
        //     isShowBaner: number(1 | 0), 
        //     cursUsd: string,
        //     __v: 0
        //   }
    }catch (err) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`});
    }
});


//= router.post('/management')
router.post('/management', auth, async (req, res) => {
    console.log(chalk.red('auth/management'));

    try {
        const body = req.body;
        // body = {
        //     isShowBaner: boolean,
        //     cursUsd: number
        // }

        if('cursUsd' in body && 'isShowBaner' in body && body.isShowBaner !== null && body.cursUsd !== null) {

            const [management] = await promisePool.query(`SELECT * FROM management`);
            
            if(isArrayEmpty(management)) {
                const [managementInsert] = await promisePool.query(`INSERT INTO management (isShowBaner, cursUsd) VALUES (${body.isShowBaner ? 1 : 0}, ${body.cursUsd})`);
                return res.status(200).json( {server: {message: 'OBJECT_CREATED'}} );
            } else {
                const idObject = management[0].id;
                const [managementUpdate] = await promisePool.query(`UPDATE management SET isShowBaner = ${body.isShowBaner ? 1 : 0}, cursUsd = ${body.cursUsd} WHERE id = ${idObject}`);
                return res.status(200).json( {server: {message: 'OBJECT_UPDATE'}} );
            } 

        } else {
            return res.status(400).json( {error: {message: 'DATA_IS_NOT_VALID'}} );
        }

    }catch (err) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`}); 
    }
});

module.exports = router;

