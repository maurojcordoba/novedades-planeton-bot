const { Telegraf } = require('telegraf');
const fs = require('fs');
const chats = require('./chats');
const planeton = require('./planeton');
const path = require('path');

require('dotenv').config();

export default function handler(req, res) {
  console.log("Inicio cron");
  const dataPath = path.join(__dirname, '/data/data.json');
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const data_chats = chats.getAll();

  planeton.getNews().then((news) => {
    let data = JSON.parse(fs.readFileSync(dataPath));
console.log(data);
    //novedades
    news.forEach((item) => {
      const found = data.find((game) => game.id == item.id);

      if (!found) {
        let captionText = `[${item.title}](${item.link})\nPrecio: ${item.price} - _Sin login_`;
        let photoId = item.img;

        data_chats.forEach((chat_id) =>
          bot.telegram
            .sendPhoto(chat_id, photoId, { caption: captionText, parse_mode: 'Markdown' })
            .then(() => console.log('Mensaje enviado: ', item.title))
            .catch((error) => console.error('Error al enviar el mensaje:', item.title, error))
        );
      }
    });
    fs.writeFileSync(dataPath, JSON.stringify(news));
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  res.status(200).end('Hello Cron!');
}

