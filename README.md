# Swell (Ecommerce) / Algolia Integration
This Module is a deep integration with Swell and Algolia allowing you to rank, facet and replicate

## Config
set a `.env` file

```
SWELL_STORE_ID=***
SWELL_SECRET_KEY=***
ALGOLIA_INDEX=***
ALGOLIA_APP_ID=***
ALGOLIA_ADMIN_API_KEY=***
```

## Algolia Config

Update the Algolia config (`algolia.config.json`) to what you need for your project.

| Field            | Description           |
| -------------    |:-------------:| -----:|
| `defaultRanking` | The ranking of your default index `ALGOLIA_INDEX` |
| `rankings` | The individual rankings for using sort, will create a seperate replicate per ranking |
| `searchableAttributes` | Algolia searchable Attributes |
| `attributesForFaceting` | Algolia Facetable Attributes |

```
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

```
sls deploy
sls invoke --function init
sls invoke --function reindex
```

`sls invoke --function init` will create the replicas based on your `algolia.config.json`
`sls invoke --function reindex` will pull all the products into Algolia
