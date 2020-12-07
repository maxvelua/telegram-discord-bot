require('dotenv').config();

const { Telegraf } = require('telegraf');
const express = require('express');
const request = require('request');

if (!process.env.TELEGRAM_BOT_API_KEY) {
    console.log('Add your telegram bot api key to .env file');
    return;
}

const client = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
const app = express();

// telegram side
client.start((ctx) => ctx.reply('Welcome'));
client.help((ctx) => ctx.reply('Send me a sticker'));
client.command('stats', (ctx) => {

});
client.on('message', async (ctx) => {  
    // send post request to discord bot
    request.post({ url: 'http://localhost:3001/discord/message', form: { message: ctx.message.text } }, function callback(err, httpReposen, body) {
        ctx.reply(body);
    });
});

// express routs
app.get('/test', (req, res) => {
    return res.send('Received a GET HTTP method');
});

// start
client.launch();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Telegram app listening on port ${process.env.PORT || 3000}`);
});