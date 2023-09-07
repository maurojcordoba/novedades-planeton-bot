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

const { Telegraf, Markup } = require('telegraf');
const chats = require('./chats');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export default async function webhook(req, res) {
  bot.start((ctx) => {
    const keyboard = Markup.inlineKeyboard(
      [
        Markup.button.callback('Activar', 'activarNovedades'),
        Markup.button.callback('Desactivar', 'desactivarNovedades'),
      ],
      { columns: 1 }
    );

    return ctx.reply(
      `Bienvenido ${ctx.message.from.first_name}! puedes activar o desactivar las notificaciones de novedades:`,
      keyboard
    );
  });

  // boton 'Activar'
  bot.action('activarNovedades', async (ctx, next) => {
    let chat_id = ctx.from.id;
    let data = chats.getAll();

    let found = data.includes(chat_id);
    if (!found) {
      chats.push(chat_id);
      return await ctx.editMessageText('Se han activado las notificaciones! 😏');
    } else {
      return await ctx.editMessageText(
        'Ya estás habilitado 😁. Para desactivar las notificaciones /start -> Desactivar'
      );
    }
  });

  // boton 'Desactivar'
  bot.action('desactivarNovedades', async (ctx, next) => {
    let chat_id = ctx.from.id;
    let data = chats.getAll();

    let found = data.includes(chat_id);
    if (found) {
      chats.remove(chat_id);
      return await ctx.editMessageText('Se han desactivado las notificaciones. 😒');
    } else {
      return await ctx.editMessageText(
        'No te encuentras habilitado 🤪. Para activar las notificaciones /start -> Activar'
      );
    }
  });

      // bot handles processed data from the event bod
      //serveless    
      await bot.handleUpdate(req.body, res);

      // Enable graceful stop
      process.once('SIGINT', () => bot.stop('SIGINT'))
      process.once('SIGTERM', () => bot.stop('SIGTERM'))
      //bot.launch(); //para correr y dejar escuchando
}

