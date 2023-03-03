const fetch = require('node-fetch');
const cheerio = require('cheerio');



/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  

  const products = $('.product-grid .grid__item')
    .map((i, element) => {
      const name = $(element)
        .find(".full-unstyled-link")
        .first()
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseFloat(
        $(element)
          .find('.price__sale')
          .text()
          .replace(/[^0-9.,]/g, '')
          .replace(',', '.'));
    const link =  "https://shop.circlesportswear.com" + $(element)
          .find('.full-unstyled-link').attr("href");
    const brand = "Circlesportswear";
    const scrapdate = new Date();
  

      return {name, price, link , brand,scrapdate};
    })
    .get();

  return products;
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

