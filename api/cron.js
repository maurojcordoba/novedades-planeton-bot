import { Telegraf } from 'telegraf';
import { sql } from '@vercel/postgres';
import { getNewGames } from './planeton.js';

const bot = new Telegraf(process.env.BOT_TOKEN);
const chats = await sql`SELECT * FROM chats;`;
const data_chats = chats.rows;
const news = await sql`SELECT * FROM news;`;
const data = news.rows;

export default async function handler(req, res) {
  let newGames = await getNewGames();

  for (const item of newGames) {
    const found = data.find((game) => game.id == item.id);

    if (!found) {
      let captionText = `[${item.title}](${item.link})\nPrecio: ${item.price} - _Sin login_`;
      let photoId = item.img;
      try {
        for (const chat of data_chats) {
          await bot.telegram.sendPhoto(chat.id, photoId, {
            caption: captionText,
            parse_mode: 'Markdown',
          });
        }
      } catch (error) {
        console.log('Error', item.id, error);
      }

      await sql`INSERT INTO news (Id, Img, Title, Link, Price) VALUES (${item.id}, ${item.img}, ${item.title}, ${item.link}, ${item.price});`;
    }
  }

  res.status(200).json(newGames);
}
