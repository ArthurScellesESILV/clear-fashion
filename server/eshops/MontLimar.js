const fetch = require('node-fetch');
const cheerio = require('cheerio');


//https://www.montlimart.com/101-t-shirts
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  const products = $('.products-list .product-miniature')
    .map((i, element) => {
      const name = $(element)
        .find('.product-miniature__title a')
        .text()
        .trim();
      const price = parseFloat(
        $(element)
          .find('.product-miniature__pricing .price')
          .text()
          .replace(/[^0-9.,]/g, '')
          .replace(',', '.'));
    const link =  $(element)
          .find('.text-reset').attr("href");
    const brand = "MontLimart";

      return {name, price, link , brand};
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

