import { Telegraf } from 'telegraf';

import { getNews } from './planeton';

import { sql } from '@vercel/postgres';


const bot = new Telegraf(process.env.BOT_TOKEN);
const data_chats = chats.getAll();
const data = JSON.parse(fs.readFileSync(dataPath));

export default async function handler(req, res) {
  let news = await getNews();

  for (const item of news) {
    const found = data.find((game) => game.id == item.id);
    if (!found) {
      let captionText = `[${item.title}](${item.link})\nPrecio: ${item.price} - _Sin login_`;
      let photoId = item.img;
      try {
        for (const chat_id of data_chats) {
          await bot.telegram.sendPhoto(chat_id, photoId, {
            caption: captionText,
            parse_mode: 'Markdown',
          });
          console.log('envio ', item.title);
        }
      } catch (error) {
        console.log('Error', item.id, error);
      }
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(news));

  res.status(200).json('ok');
}
