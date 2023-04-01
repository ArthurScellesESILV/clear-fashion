const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

const {MongoClient} = require('mongodb');


//ENDPOINT 2 http://localhost:8092/products/search?limit=10&brand=MontLimart&price=10

app.get('/products/search', async (request, response) => {
  const MONGODB_URI = 'mongodb+srv://arthur:1472@clear.4ajqg8t.mongodb.net/?retryWrites=true&w=majority';
  const MONGODB_DB_NAME = 'clear';
  try{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    
    const db = client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');




    let cherchelimit = request.query.limit || 10;
    let cherchebrand = request.query.brand || undefined;
    let chercheprice = request.query.price || undefined;

    let query = {};
    if (cherchebrand !== undefined) {query.brand = cherchebrand;}
    if (chercheprice !== undefined) {query.price = { $lte: parseInt(chercheprice) };}

    let endpoint2 = await collection
    .find(query)
    .limit(parseInt(cherchelimit))
    .sort({ price: 1 })
    .toArray();

	  response.send({result : endpoint2});
    console.log({result : endpoint2})
  } catch(e){response.send({error : "NOT A CORRECT RESEARCH"});  }
});

//ENDPOINT 1 http://localhost:8092/products/6419de790c2c85dcca6366da
/*let ObjectId = require('mongodb').ObjectId;
app.get('/products/:id', async (request, response) => {
  const MONGODB_URI = 'mongodb+srv://arthur:1472@clear.4ajqg8t.mongodb.net/?retryWrites=true&w=majority';
  const MONGODB_DB_NAME = 'clear';
  try{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});

    const db = client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');


	  const findProduct = request.params.id;
	  let endpoint1 = await collection.findOne({_id: ObjectId(findProduct)});
	  response.send({result : endpoint1});
    console.log({result : endpoint1})
  } catch(e){response.send({error : "NOT A CORRECT ID"});  }
});*/

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
