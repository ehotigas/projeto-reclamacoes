"use strict";const fs = require('fs');

function readJSON(path) {
    try {
        const jsonString = fs.readFileSync(path);
        return JSON.parse(jsonString);
      } catch (err) {
        console.log(err);
        return {  };
      }
}

module.exports = {
    readJSON
};