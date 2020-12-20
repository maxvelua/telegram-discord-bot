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
client.on('message', async (ctx) => {
    const type = ctx.updateSubTypes[0];

    if (type === 'animation' ||
        type === 'photo' ||
        type === 'video') {

        const content = await telegramService.getContentObject(ctx.telegram, ctx.update.message, type);
        const maxUploadFileSize = await discordController.getMaxUploadFileSize();

        if (content.fileSize < maxUploadFileSize) {
            const response = await discordController.sendContent(JSON.stringify(content));
            ctx.reply(response);
        } else {
            ctx.reply('Your meme is too big, pls boost your server❗');
        }
    } else {
        ctx.reply('This meme type doesn\'t support yet❗');
    }
});

// start
client.launch();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Telegram app listening on port ${process.env.PORT || 3000}`);
});