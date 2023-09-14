import * as cheerio from 'cheerio';

//busco novedades
const getNewGames = async () => {
  try {
    let metadata = [];
    let response = await fetch('https://www.planetongames.com/es/');
    let data = await response.text();
    let html = await data;

    let $ = cheerio.load(html);

    $('article').each((i, element) => {
      let id = $(element).attr('data-id-product');
      let img = $(element).find('img').attr('src');
      let title = $(element).find('h3.elementor-title').text();
      let price = $(element).find('span.elementor-price').text();
      let link = $(element).find('a.elementor-product-link').attr('href');

      metadata.push({ id, img, title, link, price });
    });

    return metadata;
  } catch (error) {
    console.log(error);
  }
}

export { getNewGames }