// Script to squish a bunch of js into one file

var fs = require('fs');
var output_filename = "build_output.js"

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

var build_data = readJSON("build.json");

console.log('Data:', build_data);

var output = "";
build_data.files.forEach(function(filename) {
  output += fs.readFileSync(filename) + "\n";
})

fs.writeFileSync(output_filename, output);
console.log('Done');

// TODO: call zipbuild.sh

// also include js from index.html