const algoliasearch = require("algoliasearch");
const config = require("./algolia.config.json");

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX);


module.exports.indexProduct = async (product, id) => {
  index.saveObject({ objectID: id, ...product })
};

module.exports.removerProductFromIndex = async (id) => {
  index.deleteObject( id )
};

module.exports.setSettings = async () => {
  // set parent settings
  let replicas = config.rankings.map((ranking) => `${process.env.ALGOLIA_INDEX}_${ranking.prefix}`);

  await index.setSettings({
    replicas,
    attributesForFaceting: config.attributesForFaceting,
    searchableAttributes: config.searchableAttributes,
    ranking: config.defaultRanking
  })

  // update ranking on each of the replicas
  for (const replica of replicas) {
    let replicaIndex = client.initIndex(replica);
    let prefixName = replica.replace(`${process.env.ALGOLIA_INDEX}_`, '')
    
    await replicaIndex.setSettings({
      attributesForFaceting: config.attributesForFaceting,
      searchableAttributes: config.searchableAttributes,
      ranking: config.rankings.find((ranking) => ranking.prefix == prefixName).ranking
    })
  };

  return true;
};
