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

