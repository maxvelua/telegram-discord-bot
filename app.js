require('dotenv').config();

const { Telegraf } = require('telegraf');
const discordController = require('./controllers/discord.controller');
const telegramService = require('./services/telegram.service');
const express = require('express');

if (!process.env.TELEGRAM_BOT_API_KEY ||
    !process.env.DISCORD_INVITE_URL ||
    !process.env.TELEGRAM_USERNAME) {
    console.log('Pls check api keys in .env file');
    return;
}

const client = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
const app = express();

// telegram side
client.start((ctx) => ctx.reply('Просто відправ мені мемас, а решту роботи я зроблю за тебе.'));

client.help((ctx) => ctx.reply(
    'Відправляй мені мемаси, а я перекину їх в дс.' +
    '\nНаразі бот працює тільки з одним сервером.' +
    `\n${process.env.DISCORD_INVITE_URL}` +
    `\n @${process.env.TELEGRAM_USERNAME}`)
);

client.on('message', async (ctx) => {
    const type = ctx.updateSubTypes[0];
    console.log(ctx);
    if (type === 'animation' ||
        (type === 'sticker' && !ctx.update.message.sticker.is_animated) ||
        type === 'photo' ||
        type === 'video') {

        const content = await telegramService.getContentObject(ctx.telegram, ctx.update.message, type);
        const maxUploadFileSize = await discordController.getMaxUploadFileSize();

        if (content.fileSize < maxUploadFileSize) {
            const response = await discordController.sendContent(JSON.stringify(content));
            ctx.reply(response);
        } else {
            ctx.reply('Ваш мем занадто великий, будь ласка, прискорте сервер❗');
        }
    } else {
        ctx.reply('Це тип мемів ще  не підтримується❗' +
            '\n\\meme щоб дізнатись більше про можливості бота.');
    }
});

// start
client.launch();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Telegram app listening on port ${process.env.PORT || 3000}`);
});