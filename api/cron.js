const { Telegraf } = require('telegraf');
const cheerio = require('cheerio');
const fs = require('fs');
const chats = require('./chats');
const path = require('path');

require('dotenv').config();



const dataPath = path.join(__dirname, '/data/data.json');
const bot = new Telegraf(process.env.BOT_TOKEN);
const data_chats = chats.getAll();
const data = JSON.parse(fs.readFileSync(dataPath));

export default async function handler(req, res) {
  
    fetch('https://www.planetongames.com/es/')
      .then((response) => response.text())
      .then((html) => {
        let metadata = [];
        let $ = cheerio.load(html);

        $('article').each((i, element) => {          
          let id = $(element).attr('data-id-product');
          let img = $(element).find('img').attr('src');
          let title = $(element).find('h3.elementor-title').text();
          let price = $(element).find('span.elementor-price').text();
          let link = $(element).find('a.elementor-product-link').attr('href');

          metadata.push({ id, img, title, link, price });
        });

        //busco y envio novedades
        metadata.forEach((item) => {
          const found = data.find((game) => game.id == item.id);
          
          if (!found) {
            console.log('DEBO Enviar:', item.title);
            let captionText = `[${item.title}](${item.link})\nPrecio: ${item.price} - _Sin login_`;
            let photoId = item.img;
            
            data_chats.forEach((chat_id) =>{
              console.log('chat_id',chat_id);
              bot.telegram
                .sendPhoto(chat_id, photoId, { caption: captionText, parse_mode: 'Markdown' })
                .then(() => console.log('Mensaje enviado: ', item.title))
                .catch((error) => console.error('Error al enviar el mensaje:', item.title, error))
            }
            );
          }
        });
        //fs.writeFileSync(dataPath, JSON.stringify(metadata));
        
        res.status(200).end(`Ok! ${process.env.BOT_TOKEN}`);
      });     
}