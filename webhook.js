const Product = require('./product')


const EVENT_MAP = {
  'product.updated': Product.updated,
  'product.created': Product.created,
  'product.variant.created': Product.variant_created,
  'product.variant.updated': Product.variant_updated,
  'product.variant.deleted': Product.variant_deleted,
  'product.stock_adjusted': Product.stock_adjusted,
}


module.exports.ingest = (event, context, callback) => {
  let parsedWebhookBody = JSON.parse(event.body)
  EVENT_MAP[parsedWebhookBody.type](parsedWebhookBody.data)

  // always return a 200
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ result: true }),
  };

  callback(null, response);
};
