"use strict";

const config = require("config"),
      csv = require('csv-to-json'),
      assert = require("assert");

class DataProvider {

    constructor(onReadyCallback) {
        let that = this;
        this.DATA = [];
        csv.parse({ filename: "./data/VisaEverywhereShop.css" }, function(err, json) {
            that.DATA = json;
            onReadyCallback("DataProvider -> number of test data entries loaded: " + json.length);
        });
        console.log("DataProvider initialized");
    }

    /**
     * Initiates a connection to a data source, e.g. static files, and/or DB
     * @returns a Promise object, which resolves when a successful connection to data source established   
     */
    fetchData(param) {
        return new Promise((resolve, reject) => {        
            if (this.DATA===undefined) {
                reject("no data found");
            } else {
                resolve(this.DATA);
            }
        });
    }
}

module.exports = DataProvider;
