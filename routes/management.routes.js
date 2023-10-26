const express = require('express');
const router = express.Router({mergeParams: true});
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api'); 

//const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: true,
    request: {
        agentOptions: {
            rejectUnauthorized: false
        }
    }
});


router.post('/telegram', async (req, res) => { 
    try {

        function sendTelegram(id, msg) {
            bot.sendMessage(id, msg);
        }
        

        const chatIdArray = JSON.parse(process.env.CHAT_ID_ARRAY); 

        const body = req.body;
        // body = {
        //     title: string,
        //     name: string,
        //     tel: string
        // }
        console.log(body);

        if(body && chatIdArray && Array.isArray(chatIdArray)) {
            const message = `Новое сообщение c сайта best-potolok.by:\nФорма отправки: ${body?.title ? body.title : 'нет информации'}\nИмя клиена: ${body?.name ? body.name : 'нет информации'}\nТелефон: ${body.tel ? body.tel : 'нет информации'}`;
            
            chatIdArray.forEach(user => {
                sendTelegram(user, message);
            });

            return res.status(200).send( {server: {message: 'MESSAGE_SEND'}} );
            
        } else {
            return res.status(200).send( {error: {message: 'NOT_INFO'}} );
        }

    }catch (err) {
        res.status(500).json({message: `Ошибка сервера, попробуйте позже...${err}`}); 
    }
});

module.exports = router; 


