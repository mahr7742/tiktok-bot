const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
bot.sendMessage(msg.chat.id,'أرسل رابط تيك توك');
});

bot.on('message', async (msg) => {
const text = msg.text;

if (!text.includes('tiktok.com')) return;

try {
const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`;

const res = await axios.get(api);

bot.sendVideo(msg.chat.id, res.data.data.play);

} catch {
bot.sendMessage(msg.chat.id,'حدث خطأ');
}
});
