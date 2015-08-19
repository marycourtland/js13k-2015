node build.js
mkdir minified
cp index.htm minified/index.htm
uglifyjs build_output.js > minified/min.js
tar -zcvf minified.tar.gz minified
rm -rf minified
