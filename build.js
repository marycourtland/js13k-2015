// Script to squish a bunch of js into one file

var fs = require('fs');
var output_filename = "min.js"

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

var build_data = readJSON("build.json");

var output = "(function() {";
build_data.files.forEach(function(filename) {
  output += fs.readFileSync(filename) + "\n";
})
output += "})();"

fs.writeFileSync(output_filename, output);
console.log('Done');
