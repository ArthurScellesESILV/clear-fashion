const fetch = require('node-fetch');
const cheerio = require('cheerio');


const parseurl = data => {
  const $ = cheerio.load(data);

  return $('.container .li-niveau1  ')
    .map((i, element) => {
      const url = $(element).find('.a-niveau1').attr("href");
      return {url};
    })
    .get();
};


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
      const filteredUrls = parseurl(body).filter(item => item.url);
      let allProducts = [];
      for (const urlObject of filteredUrls) {
        const response = await fetch(urlObject.url);
        const body = await response.text();
        Product = parse(body);
        allProducts = [...allProducts, ...Product];
      }

      return allProducts ;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

