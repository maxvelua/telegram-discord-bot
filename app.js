require('dotenv').config();

const { Telegraf } = require('telegraf');
const discordController = require('./controllers/discord.controller');
const telegramService = require('./services/telegram.service');
const express = require('express');

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
    const type = ctx.updateSubTypes[0];

    if (type === 'animation' ||
        type === 'photo' ||
        type === 'video' ||
        type === 'voice') {

        const content = await telegramService.getContentObject(ctx.telegram, ctx.update.message, type);
        const response = await discordController.sendContent(JSON.stringify(content));

        ctx.reply(response);
    }
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