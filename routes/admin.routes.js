const express = require('express');
const router = express.Router({mergeParams: true});
const chalk = require('chalk');
const auth = require('../middleware/auth.middleware');
const Management = require('../models/Management');

router.get('/test', async (req, res) => {
    try {
        res.send(JSON.stringify({res: 'Привет от Админа !'}));
    }catch (error) {
        console.log('Error in Function  >>> ', error);
    }
});

//= router.get('/management')
router.get('/management', async (req, res) => {
    try {
        const management = await Management.find();   

        if(!management[0]) return res.status(200).json( {error: {message: 'OBJECT_NOT_FOUND'}} );
        management[0].cursUsd = management[0].cursUsd + '';

        return res.status(200).send(management[0]);
        // management[0] = { 
        //     _id: object,
        //     isShowBaner: boolean, 
        //     cursUsd: string,
        //     __v: 0
        //   }
    }catch (err) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`});
    }
});


//= router.post('/management')
router.post('/management', auth('Admin'), async (req, res) => {
    console.log(chalk.red('/management'));

    try {
        const body = req.body;
        // body = {
        //     isShowBaner: boolean,
        //     cursUsd: number
        // }

        if('cursUsd' in body && 'isShowBaner' in body && body.isShowBaner !== null && body.cursUsd !== null) {
            const management = await Management.find(); 

            if(!management[0]) {
                const newManagement = await Management.create({...body});
                return res.status(200).json( {server: {message: 'OBJECT_CREATED'}} );
            } else {
                management[0].isShowBaner = body.isShowBaner;
                management[0].cursUsd = body.cursUsd;

                const newManagement = await management[0].save(); 
                
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

