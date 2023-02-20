/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/MontLimar');
const circle = require('./eshops/Circle');
const fs = require('fs');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    eshop2 = 'https://www.montlimart.com/101-t-shirts'
    const products2 = await montlimart.scrape(eshop2);

    eshop3 = 'https://shop.circlesportswear.com/collections/t-shirts-homme'
    const products3 = await circle.scrape(eshop3);
    let allProducts = products.concat(products2, products3);
    const jsonData = JSON.stringify(products, null, 2);




    console.log(jsonData);
    fs.writeFile('produit.json', jsonData, (err) => {
      if (err) {
        throw err;
      }
      console.log('Les données ont été écrites dans le fichier produit.json.');
    });


    console.log('done');
    process.exit(0);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  
}

const [,, eshop] = process.argv;

sandbox(eshop);




