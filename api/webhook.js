import { Telegraf, Markup } from 'telegraf';
import { sql } from '@vercel/postgres';

const bot = new Telegraf(process.env.BOT_TOKEN);

export default async function webhook(req, res) {
  bot.start((ctx) => {
    const keyboard = Markup.inlineKeyboard(
      [
        Markup.button.callback('Activar', 'activarNovedades'),
        Markup.button.callback('Desactivar', 'desactivarNovedades'),
        Markup.button.callback('Ultimas Novedades', 'ultimasNovedades'),
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
    const { rows } = await sql`SELECT * FROM chats WHERE id = ${chat_id};`;

    if (rows.length <= 0) {
      await sql`INSERT INTO chats (id) VALUES (${chat_id});`;
      return await ctx.editMessageText(
        'Se han activado las notificaciones! 😏'
      );
    } else {
      return await ctx.editMessageText(
        'Ya estás habilitado 😁. Para desactivar las notificaciones /start -> Desactivar'
      );
    }
  });

  // boton 'Desactivar'
  bot.action('desactivarNovedades', async (ctx, next) => {
    let chat_id = ctx.from.id;
    const { rows } = await sql`SELECT * FROM chats WHERE id = ${chat_id};`;

    if (rows.length > 0) {
      await sql`DELETE FROM chats WHERE id =${chat_id};`;
      return await ctx.editMessageText(
        'Se han desactivado las notificaciones. 😒'
      );
    } else {
      return await ctx.editMessageText(
        'No te encuentras habilitado 🤪. Para activar las notificaciones /start -> Activar'
      );
    }
  });

  // boton 'Ultimas Novedades'
  bot.action('ultimasNovedades', async (ctx, next) => {
    const { rows } = await sql`SELECT title, link, price FROM news;`;

    if (rows.length > 0) {
      let captionText = '';
      rows.forEach((item) => {
        captionText += `[${item.title}](${item.link})\nPrecio: ${item.price} \n\n`;
      });

      return await ctx.editMessageText(captionText);
    } else {
      return await ctx.editMessageText('No hay novedades!');
    }
  });

  // bot handles processed data from the event bod
  //serveless
  await bot.handleUpdate(req.body, res);

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
  //bot.launch(); //para correr y dejar escuchando
}
