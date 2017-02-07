"use strict";

const crypto = require('crypto'),
      assert = require("assert");
let SHARED_SECRET; // can only get value once

function validate(req, res, next) {
    assert.ok((SHARED_SECRET!==undefined), "There is no SHARED_SECRET specified. Specify it when component initialized.");
    if (req.headers['service-api-key']===undefined || req.headers['x-vendor-key']===undefined) {
        return res.status(401).json({
            message: "missing authentication headers" // for security reasons, do not tell what should be there
        });
    }
    // received information
    let service_api_key = req.headers['service-api-key'], 
        x_vendor_key = req.headers['x-vendor-key'], 
        api_path = req.originalUrl || req.baseUrl;
    // process input information    
    let vendorKeySplits = x_vendor_key.split(":"),
        timestamp = vendorKeySplits[1],
        vendorHash = vendorKeySplits[2];
    // computed information from input & shared secret
    var computedHash = computeHash(api_path, service_api_key, timestamp);
    // check matching
    if (vendorHash === computedHash) {
        next();
    } else {
        return res.status(401).json({
                    message: "invalid x-vendor-key for the specified service" // only tell what's wrong
                });
    }
}

function computeHash(api_path, service_api_key, timestamp) {
    var hashString = api_path + service_api_key + timestamp + SHARED_SECRET;
    return crypto.createHash('sha256').update(hashString).digest('hex').toLowerCase();
}

function generateXVendorKey(apiPath, serviceApiKey) {
    let now = Math.floor(new Date().getTime()/1000);
    return "x:" + now + ":" + computeHash(apiPath, serviceApiKey, now);
}

module.exports = function(sharedSecret) {
    assert.ok((sharedSecret!==undefined), "\n\tYou must provide a shared secret for creating and using the VIP access validator in your code like:\n\t\tconst accessValidator = require('vip-access-validator');\n\t\t...\n\t\tmyExpressApp.use(accessValidator('mySharedSecret'));\n");
    SHARED_SECRET = sharedSecret;
    return validate;
}
