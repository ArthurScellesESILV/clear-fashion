/* eslint-disable no-console, no-process-exit */



const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/MontLimar');
const circle = require('./eshops/Circle');  
const fs = require('fs');
const {MongoClient} = require('mongodb'); 

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/',eshop2 = 'https://www.montlimart.com/magasins#',eshop3 = 'https://shop.circlesportswear.com/collections/all') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    
  
    const products2 = await montlimart.scrape(eshop2);

    const products3 = await circle.scrape(eshop3);

    let allProducts = products.concat(products2, products3);
    const jsonData = JSON.stringify(allProducts, null, 2);

    await fs.writeFile('produit.json', jsonData, (err) => {
      if (err) {
        throw err;
      }
      console.log('Les données ont été écrites dans le fichier produit.json.');
    });
//writefilesinc https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options



    console.log(jsonData);
    console.log(allProducts.length);
    console.log('done');
    run(allProducts);


    return allProducts;

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  
}



const [,, eshop] = process.argv;





async function run(allProducts) {
  const MONGODB_URI = 'mongodb+srv://arthur:1472@clear.4ajqg8t.mongodb.net/?retryWrites=true&w=majority';
  const MONGODB_DB_NAME = 'clear';

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  console.log("insert");
  const db = client.db(MONGODB_DB_NAME);
  console.log("insert");
  const collection = db.collection('products');
  console.log("insert");
  
  const result = await collection.insertMany(allProducts);

  console.log("insert");

  console.log("test : Dedicated products");
  const D = await collection.find({price : 25}).toArray();

  console.log(D);
  client.close();
}

sandbox(eshop);




