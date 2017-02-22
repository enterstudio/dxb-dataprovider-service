// Swaggerize application APIs

var express = require('express'),
    swaggerJSDoc = require('swagger-jsdoc');

function setup(app) {
    // Set default options for Swagger
    var swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: "App Data Provider Microservice",
                version: "1.0.0",
            },
            host: "innovation-platform-dev.herokuapp.com",
            schemes: ["https"]
        },
        apis: ['./index.js'], // Path to the API docs
    };

    // Initialize swagger-jsdoc -> returns validated swagger spec in json format
    var swaggerSpec = swaggerJSDoc(swaggerOptions);

    // Serve Swagger UI with proper json definition
//     var swaggerUI = express();
//     app.use('/sw', swaggerUI);
//     swaggerUI.get('/', function (req, res) {
//         var fullUrl = req.protocol + '://' + req.get('host');
//         var apiDocsUrl = fullUrl + '/sw/api-docs.json';
//         res.redirect(fullUrl + '/sw/index.html?url=' + apiDocsUrl);
//     });
//     console.log(__dirname + "../sw");
//     swaggerUI.use(express.static(__dirname + "/../sw")); // TODO this __dirname might not be the case, it depends on where this source is located

    // Serve generated swagger specification under Swagger UI path
    app.get('/api/', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log("SwaggerUI enabled for documented APIs, visit http://<server>/sw subpage after server is up and running, you must have swagger-ui HTML frontend downloaded and placed uner 'sw' folder");
}

module.exports = function(app) {
    setup(app);
}
