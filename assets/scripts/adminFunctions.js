const { prisma } = require('./logic')
const textDb = require('../db/texts/texts.json')
const fs = require('fs')

async function waitForText(bot, chatId) {
    return new Promise((resolve) => {
      bot.onText(/.*/, (msg) => {
        if (msg.from.username === chatId) {
          resolve(msg);
          console.log(msg.text)
        }
      });
    });
  }
  

async function addBalance(bot, msg) {
    try {
        await bot.sendMessage(msg.chat.id, "Пришлите мне имя пользователя, которому хотите добавить баланс");
        console.log("программа дальше не идет разбирайся почему гы )")
        console.log(msg.text)
        const username = await waitForText(bot, msg.from.username)
        console.log(`Имя пользователя: ${username}`);

        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user) {
            await bot.sendMessage(msg.chat.id, "Пользователь с таким именем не найден.");
            return;
        }

        await bot.sendMessage("Пришлите мне, сколько Ton хотите добавить");
        const balanceText = await waitForText(bot, ctx);
        const balance = parseInt(balanceText, 10);

        if (isNaN(balance)) {
            await bot.sendMessage(msg.chat.id, "Пожалуйста, пришлите корректное число.");
            return;
        }

        await prisma.user.update({
            where: { username: username },
            data: {
                tonBalance: user.tonBalance + balance,
            },
        });

        await bot.sendMessage(msg.chat.id, "Все сохранилось успешно");
    } catch (error) {
        console.log(error)
        console.error("Произошла ошибка при обновлении баланса:", error);
        await bot.sendMessage(msg.chat.id, "Произошла ошибка при обновлении баланса.");
    } finally {
        await prisma.$disconnect();
    }
}

async function addText(bot, msg){
    const emptyArray = []
    await bot.sendMessage(msg.chat.id, "Пришлите мне текст сообщения")
    const message = await waitForText(bot, msg.from.username)
    emptyArray.push({text: message.text})
    fs.writeFileSync('./assets/db/texts/texts.json', JSON.stringify(emptyArray, null, '\t'))
    await bot.sendMessage(msg.chat.id, "Текст был успешно добавлен")
}


module.exports = {
    addBalance: addBalance,
    addText: addText
}