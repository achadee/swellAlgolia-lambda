'use strict';
const Swell = require('./swell')
const Algolia = require('./algolia')

module.exports.created = async event => {
  let product = await Swell.getProduct(id);
  return product.active ? Algolia.indexProduct(product, id) : true
};

module.exports.updated = async ( { id } ) => {
  let product = await Swell.getProduct(id);
  return product.active ? Algolia.indexProduct(product, id) : Algolia.removerProductFromIndex(id)
};

module.exports.deleted = async ( { id } ) => {
  return Algolia.removerProductFromIndex(id)
};

module.exports.stock_adjusted = async event => {
  let product = await Swell.getProduct(id);
  return product.active ? Algolia.indexProduct(product, id) : Algolia.removerProductFromIndex(id)
};

module.exports.variant_created = async event => {
  let product = await Swell.getProduct(id);
  return product.active ? Algolia.indexProduct(product, id) : Algolia.removerProductFromIndex(id)
};

module.exports.variant_updated = async event => {
  let product = await Swell.getProduct(id);
  return product.active ? Algolia.indexProduct(product, id) : Algolia.removerProductFromIndex(id)
};

module.exports.variant_deleted = async event => {
  let product = await Swell.getProduct(id);
  return product.active ? Algolia.indexProduct(product, id) : Algolia.removerProductFromIndex(id)
};


module.exports.reindex = async event => {

  // big function to copy all products to algolia

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
