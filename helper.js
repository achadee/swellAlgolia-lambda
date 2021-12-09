const Algolia = require('./algolia')
const Product = require('./product')
module.exports.init = async event => {
  // create replicas
  Algolia.setSettings();
};


module.exports.reindex = async event => {
  // create replicas
  Product.reindex();
};
