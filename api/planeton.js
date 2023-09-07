const cheerio = require('cheerio');

async function getNews() {
  try {
    let metadata = [];
    let response = await fetch('https://www.planetongames.com/es/');
    let data = await response.text();
    let html = await data;

    let $ = cheerio.load(html);

    $('article').each((i, element) => {
      id = $(element).attr('data-id-product');
      img = $(element).find('img').attr('src');
      title = $(element).find('h3.elementor-title').text();
      price = $(element).find('span.elementor-price').text();
      link = $(element).find('a.elementor-product-link').attr('href');

      metadata.push({ id, img, title, link, price });
    });

    return metadata;
  } catch (error) {
    console.log(error);
  }
}

module.exports.getNews = getNews;

