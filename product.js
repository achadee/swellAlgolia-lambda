'use strict';
const Swell = require('./swell')
const Algolia = require('./algolia')
const cliProgress = require('cli-progress');


const getAllCategories = async () => {
  return await Swell.getAllCategories();
}

const getCategories = async (product) => {
  return await Swell.getCategories(product);
}

const getPageOfProducts = async (pageNumber) => {
  return await Swell.getProducts(pageNumber);
}

// returns a category list from a cached all category list
const getCategoriesFromList = (product, allCategories) => {
  const result = {names: [], slugs: []}

  for (const categoryId of product.category_index.id) {
    let matchedCategory = allCategories.find((cat) => cat.id == categoryId)

    if ( matchedCategory ) {
      result.names.push(matchedCategory.name)
      result.slugs.push(matchedCategory.slug)
    }
  }

  return result
}

module.exports.created = async event => {
  let product = await Swell.getProduct(id);
  let categories = await getCategories(product);
  return product.active ? Algolia.indexProduct(product, categories, id) : true
};

module.exports.updated = async ( { id } ) => {
  let product = await Swell.getProduct(id);
  let categories = await getCategories(product);
  return product.active ? Algolia.indexProduct(product, categories, id) : Algolia.removerProductFromIndex(id)
};

module.exports.deleted = async ( { id } ) => {
  return Algolia.removerProductFromIndex(id)
};

module.exports.stock_adjusted = async event => {
  let product = await Swell.getProduct(id);
  let categories = await getCategories(product);
  return product.active ? Algolia.indexProduct(product, categories, id) : Algolia.removerProductFromIndex(id)
};

module.exports.variant_created = async event => {
  let product = await Swell.getProduct(id);
  let categories = await getCategories(product);
  return product.active ? Algolia.indexProduct(product, categories, id) : Algolia.removerProductFromIndex(id)
};

module.exports.variant_updated = async event => {
  let product = await Swell.getProduct(id);
  let categories = await getCategories(product);
  return product.active ? Algolia.indexProduct(product, categories, id) : Algolia.removerProductFromIndex(id)
};

module.exports.variant_deleted = async event => {
  let product = await Swell.getProduct(id);
  let categories = await getCategories(product);
  return product.active ? Algolia.indexProduct(product, categories, id) : Algolia.removerProductFromIndex(id)
};

module.exports.reindex = async event => {

  let results = []
  let nextPageNumber = 1
  let currentProducts = 10

  // create a new progress bar instance and use shades_classic theme
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  let response = await getPageOfProducts(nextPageNumber)
  // start the progress bar with a total value of 200 and start value of 0
  bar1.start(response.totalCount + 10, currentProducts);


  // get all the categories, so we do need to query everytime
  const categoryList = await getAllCategories();

  currentProducts = 10
  bar1.update(currentProducts);

  while(nextPageNumber != null) {
    let response = await getPageOfProducts(nextPageNumber)

    nextPageNumber = response.nextPageNumber
    results = response.results

    for (const product of results) {
      // update the current value in your application..

      if (product.active){
        let categories = getCategoriesFromList(product, categoryList)
        Algolia.indexProduct(product, categories, product.id)
      }
      else{
        return Algolia.removerProductFromIndex(product.id)
      }
      currentProducts = currentProducts + 1
      bar1.update(currentProducts);
    }
  }

  // stop the progress bar
  bar1.stop();

  console.log("Done! Swell has been re-indexed to Algolia")

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
