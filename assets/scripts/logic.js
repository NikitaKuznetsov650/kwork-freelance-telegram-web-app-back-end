const { PrismaClient } = require("@prisma/client");
const textDb = require('../db/texts/texts.json')
const prisma = new PrismaClient();

async function createUser(bot, msg) {
  let username = msg.from.username;
  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          username: username,
          tonBalance: 0,
          gameBalance: 0,
          isPayed: false,
          isAdmin: false,
        },
      });
      await bot.sendMessage(msg.chat.id, "./assets/db/images/welcomePhoto.jpg", {
        caption: textDb[0].text,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: "1", web_app: { url: "https://web-app-opal-ten.vercel.app/" } }]
          ]
        })
      });
    } else {
      if (!user.isAdmin) {
        await bot.sendPhoto(msg.chat.id, "./assets/db/images/welcomePhoto.jpg", {
          caption: textDb[0].text,
          reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Start App", web_app: {url: "https://web-app-opal-ten.vercel.app/"}}],[{ text: "Read Me", callback_data: "asd", web_app: { url: "https://web-app-opal-ten.vercel.app/" } }], [{ text: "News", callback_data: "news" }, { text: "Chat", callback_data: "chat" }]]
            
        })
        });
      } else {
        await bot.sendMessage(msg.chat.id, "Привет админ вот что ты можешь сделать", {
          reply_markup: {
            keyboard: [
              [{ text: "Добавить баланс пользователю" }],
              [{ text: "Добавить текст на главную страницу" }]
            ],
            resize_keyboard: true
          },
        });
      }
    }
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    await bot.sendMessage(msg.chat.id, "Произошла ошибка");
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  createUser: createUser,
  prisma
};
