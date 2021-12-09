const swell = require('swell-node').init(process.env.SWELL_STORE_ID, process.env.SWELL_SECRET_KEY);

module.exports.getProduct = async (id) => {
  return swell.get('/products/{id}?expand=variants:20,images:1,categories:40', { id });
};

module.exports.getProducts = async (pageNumber) => {
  let response = await swell.get('/products', {
    expand: {
      variants: 20,
      images: 1,
      categories: 40
    },
    limit: 25,
    page: pageNumber,
  });

  // determine if there is a next page
  let nextPageNumber = response.pages && response.pages[(pageNumber + 1).toString()] ? pageNumber + 1 : null;

  return { nextPageNumber, results: response.results, totalCount: response.count }
};


// splits up the categories so that you can filter / facet by category name / slug
module.exports.getCategories = async (product) => {
  let resp = await swell.get('/categories', {
    where: {
      id: { $in: product.category_index.id }
    }
  });

  return {names: resp.results.map((cat) => cat.name), slugs: resp.results.map((cat) => cat.slug)}
};


module.exports.getAllCategories = async (product) => {
  let resp = await swell.get('/categories', {
    limit: 1000
  });

  return resp.results
};
