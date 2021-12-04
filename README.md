# Swell (Ecommerce) / Algolia Integration
This Module is a deep integration with Swell and Algolia allowing you to rank, facet and replicate

This module deploys to AWS Lambda

<img src="https://user-images.githubusercontent.com/5952918/144704411-a11545c3-53d7-4864-8d40-662e2219bb1f.png" alt="alt text" width="100">
<img src="https://user-images.githubusercontent.com/5952918/144704417-5bf94916-de01-4261-8f49-7b4a27fa38cb.png" alt="alt text" width="100">

## Config
set a `.env` file

```bash
SWELL_STORE_ID=***
SWELL_SECRET_KEY=***
ALGOLIA_INDEX=swell_products
ALGOLIA_APP_ID=***
ALGOLIA_ADMIN_API_KEY=***
```

## Algolia Config

Update the Algolia config (`algolia.config.json`) to what you need for your project.

| Field                   | Description                                                                          |
| ------------- | ------------- |
| `defaultRanking`        | The ranking of your default index `ALGOLIA_INDEX`                                    |
| `rankings`              | The individual rankings for using sort, will create a seperate replica per ranking |
| `searchableAttributes`  | Algolia searchable Attributes                                                        |
| `attributesForFaceting` | Algolia Facetable Attributes                                                         |

```json
{
  "defaultRanking": ["desc(name)"],
  "rankings": [
    {
      "prefix": "price_desc",
      "ranking": [
        "desc(price)"
      ]
    },
    {
      "prefix": "price_asc",
      "ranking": [
        "asc(price)"
      ]
    }
  ],
  "searchableAttributes": ["name"],
  "attributesForFaceting": ["attribute.brand"]
}
```

## Quick Start
The commands below will deploy the serverless function to AWS then create the indexes

```bash
sls deploy
sls invoke --function init
sls invoke --function reindex
```

`sls invoke --function init` will create the replicas based on your `algolia.config.json`
`sls invoke --function reindex` will pull all the products into Algolia


### Install webhooks on Swell

Developer > Webhooks > Add Webhook

And create a webhook as so:

<img width="648" alt="Screen Shot 2021-12-04 at 8 26 20 pm" src="https://user-images.githubusercontent.com/5952918/144704558-a88b4c00-59a9-46a5-96a6-2bfe90029aa4.png">


Replace `my-serverless-domain` with your cloudfront, or route53 domain generated from serverless on deploy

Replace `stage` with your environment stage so something like `dev` or `prod`





