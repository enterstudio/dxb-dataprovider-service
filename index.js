const config = require('config'),
      app = require('express')(),
      DataProvider = require("./data-provider"),
      accessValidator = require("./common/vip-access-validator"),
      swaggerize = require("./common/swaggerize");

// ctreate data provider instance
let dataProvider = new DataProvider(console.log);

// start server listening
let port = process.env.PORT || config.port;
app.listen(port, function () {
    console.log('Microservice started listening on port ' + port);
});

// attach VIP access validator
console.log("Attaching Visa Innovation Platform access validator to microservice, except for Swagger path");
app.all('*', (req, res, next) => {
    if ( req.path.startsWith("/sw") || req.path == "/sw") {
        return next();
    }
    accessValidator(config.shared_secret)(req, res, next);
});

/**
 * @swagger
 *  definition: 
 *      Product: {
 *          type: "object",
 *          required: [
 *              sku, 
 *              name,
 *              price.amount
 *          ],
 *          properties: {
 *              shortCode: {
 *                  type: "string"
 *              },
 *              name: {
 *                  type: "string"
 *              },
 *              description: {
 *                  type: "string"
 *              },
 *              sku: {
 *                  type: "string"
 *              },
 *              price.amount: {
 *                  type: "integer"
 *              },
 *              Catalog: {
 *                  type: "string"
 *              },
 * 	            Category: { 
 *                  type: "string"
 *              }
 *          }
 *      }
 */

/**
 * @swagger
 *  /dataprovider/products:
 *      get: {
 *          tags: ["Get Products"],
 *          summary: "Get the real-life looking data, sample products from various sources",
 *          description: "Returns list of catalogs and products, as test inventory data",
 *          operationId: "getTestData",
 *          produces: [
 *              "application/json"
 *          ],
 *          responses: {
 *              200: {
 *                  description: "successful operation, empty array if no data found",
 *                  schema: {
 *                      type: "array",
 *                      items: {
 *                          $ref: "#/definitions/Product"
 *                      }
 *                  }
 *              }
 *          }
 *      }
 */
app.get(config.api_path, function (req, res) {
    console.log("-> " + config.api_path);
    dataProvider.fetchData({}).then(data => res.json(data)).catch(msg => res.status(404).json(msg));
});

// attach Swagger documentation
swaggerize(app);
