const fetch = require('node-fetch');
const cheerio = require('cheerio');

const parseurl = data => {
  const $ = cheerio.load(data);

  return $('.mainNavigation-fixedContainer .mainNavigation-link-subMenu-link')
    .map((i, element) => {
      const url = "https://www.dedicatedbrand.com" + $(element).children('a').attr("href");
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

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      const link = "https://www.dedicatedbrand.com" + $(element)
        .find('.productList-link').attr("href");
      const brand = "Dedicated";
      const scrapdate = new Date();
      const image = $(element)
      .find('.productList-image').children("img").attr("src");
      return {name, price,link,brand,scrapdate,image};
    })
    .get();
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
      const Urls = await parseurl(body);
      let allProducts = [];
      for (const urlObject of Urls) {
        const response = await fetch(urlObject.url);
        const body = await response.text();
        Product = parse(body);
        allProducts = [...allProducts, ...Product];
      }


      return allProducts;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
