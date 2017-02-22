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

    // Serve generated swagger specification under Swagger UI path
    app.get('/api/docs', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log("Swagger API docs served from: <ROOT_PATH>/api-docs.json");
}

module.exports = function(app) {
    setup(app);
}
