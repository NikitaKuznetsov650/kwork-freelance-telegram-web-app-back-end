require('dotenv').config({ path: "./assets/modules/.env" });
const TelegramRequest = require('node-telegram-bot-api');
const bot = new TelegramRequest(process.env.devStatus ? process.env.TEST_TOKEN : process.env.DEFAULT_TOKEN, {polling: true});
const fs = require('fs');
const { createUser } = require('./assets/scripts/logic.js');
const { addBalance, addText } = require('./assets/scripts/adminFunctions.js');

const commands = JSON.parse(fs.readFileSync("./assets/commands/commands.json"));

bot.setMyCommands(commands);

bot.on("message", async (msg) => {
    if(msg.text === "/start"){
        await createUser(bot, msg)
    }
    // await ctx.replyWithPhoto({ source: "./assets/images/welcomePhoto.jpg" });
});



bot.on('message', async msg => {
    if(msg.text === "Добавить баланс пользователю"){
        addBalance(bot, msg)
    }else if (msg.text === "Добавить текст на главную страницу"){
        addText(bot, msg)
    }
})

bot.on('callback_query', async (msg) => {
    // Ваш код обработки callback_query
});

bot.on("polling_error", console.log)
