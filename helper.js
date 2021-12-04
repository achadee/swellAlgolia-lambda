const Algolia = require('./algolia')
module.exports.init = async event => {
  // create replicas
  Algolia.setSettings();
};
