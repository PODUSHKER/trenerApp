const TelegramBot = require('node-telegram-bot-api')
const token = process.env.BOT_TOKEN

const bot = new TelegramBot(token, {
    polling: {
        interval: 3000,
        autoStart: true
    }
})


module.exports = bot;