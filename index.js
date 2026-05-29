const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');
const express = require('express');

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.log("BOT_TOKEN missing");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, {
  polling: true
});

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

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
      '⏳ جاري التحميل...'
    );

    const file = `video_${Date.now()}.mp4`;

    const command =
      `yt-dlp --no-playlist -o "${file}" "${text}"`;

    exec(command, async (error, stdout, stderr) => {

      if (error) {

        console.log(stderr);

        return bot.sendMessage(
          chatId,
          '❌ فشل التحميل'
        );
      }

      try {

        await bot.sendVideo(
          chatId,
          fs.createReadStream(file),
          {
            caption: '✅ تم التحميل'
          }
        );

        fs.unlinkSync(file);

      } catch (err) {

        console.log(err);

        bot.sendMessage(
          chatId,
          '❌ فشل إرسال الفيديو'
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
