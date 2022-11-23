const fs = require('fs');

function readJSON(path: string): Object {
    try {
        const jsonString: string = fs.readFileSync(path);
        return JSON.parse(jsonString);
      } catch (err) {
        console.log(err);
        return {  };
      }
}

module.exports = {
    readJSON
};