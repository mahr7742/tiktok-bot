const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const app = express();
app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(process.env.PORT || 3000);

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // TikTok
  if (text.includes('tiktok.com')) {
    try {
      bot.sendMessage(chatId, '⏳ جاري تحميل فيديو تيك توك...');

      const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`;

      const response = await axios.get(api);

      if (!response.data.data || !response.data.data.play) {
        return bot.sendMessage(chatId, '❌ فشل تحميل فيديو تيك توك');
      }

      const videoUrl = response.data.data.play;

      await bot.sendVideo(chatId, videoUrl, {
        caption: '✅ تم تحميل فيديو TikTok'
      });

    } catch (err) {
      bot.sendMessage(chatId, '❌ حدث خطأ أثناء تحميل تيك توك');
    }
  }

  // Instagram
  else if (text.includes('instagram.com')) {
    try {
      bot.sendMessage(chatId, '⏳ جاري تحميل فيديو انستجرام...');

      const api = `https://igram.world/api/ig?url=${encodeURIComponent(text)}`;

      const response = await axios.get(api);

      if (!response.data || !response.data.video_url) {
        return bot.sendMessage(chatId, '❌ فشل تحميل فيديو انستجرام');
      }

      const videoUrl = response.data.video_url;

      await bot.sendVideo(chatId, videoUrl, {
        caption: '✅ تم تحميل فيديو Instagram'
      });

    } catch (err) {
      bot.sendMessage(chatId, '❌ حدث خطأ أثناء تحميل انستجرام');
    }
  }

  else {
    bot.sendMessage(
      chatId,
      '📥 أرسل رابط TikTok أو Instagram لتحميل الفيديو'
    );
  }
});
