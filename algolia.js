const algoliasearch = require("algoliasearch");
const config = require("./algolia.config.json");

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX);


module.exports.indexProduct = async (product, categories, id) => {
  index.saveObject(
    {
      objectID: id,
      ...product,
      category_slugs: categories.slugs,
      categories: categories.names
    }
  )
};

module.exports.removerProductFromIndex = async (id) => {
  index.deleteObject( id )
};

module.exports.setSettings = async () => {
  // set parent settings
  let replicas = config.rankings.map((ranking) => `${process.env.ALGOLIA_INDEX}_${ranking.suffix}`);

  await index.setSettings({
    replicas,
    attributesForFaceting: config.attributesForFaceting,
    searchableAttributes: config.searchableAttributes,
    ranking: config.defaultRanking
  })

  // update ranking on each of the replicas
  for (const replica of replicas) {
    let replicaIndex = client.initIndex(replica);
    let suffixName = replica.replace(`${process.env.ALGOLIA_INDEX}_`, '')

    await replicaIndex.setSettings({
      attributesForFaceting: config.attributesForFaceting,
      searchableAttributes: config.searchableAttributes,
      ranking: config.rankings.find((ranking) => ranking.suffix == suffixName).ranking
    })
  };

  return true;
};
