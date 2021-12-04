const swell = require('swell-node').init(process.env.SWELL_STORE_ID, process.env.SWELL_SECRET_KEY);

module.exports.getProduct = async (id) => {
  return swell.get('/products/{id}?expand=variants:20,images:1,categories:40', { id });
};
