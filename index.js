const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, {
  polling: true
});

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(process.env.PORT || 3000);

bot.on('message', async (msg) => {

  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  if (
    text.includes('tiktok.com') ||
    text.includes('instagram.com')
  ) {

    bot.sendMessage(
      chatId,
      '⏳ جاري تحميل الفيديو...'
    );

    const fileName = `video_${Date.now()}.mp4`;

    const command =
      `yt-dlp -f mp4 -o "${fileName}" "${text}"`;

    exec(command, async (error) => {

      if (error) {
        console.log(error);

        return bot.sendMessage(
          chatId,
          '❌ فشل تحميل الفيديو'
        );
      }

      try {

        await bot.sendVideo(
          chatId,
          fileName,
          {
            caption: '✅ تم تحميل الفيديو'
          }
        );

        fs.unlinkSync(fileName);

      } catch (err) {

        console.log(err);

        bot.sendMessage(
          chatId,
          '❌ حدث خطأ أثناء الإرسال'
        );
      }

    });

  } else {

    bot.sendMessage(
      chatId,
      '📥 أرسل رابط TikTok أو Instagram'
    );

  }

});
