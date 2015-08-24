node build.js
mkdir minified
cp index.html minified/index.html
cat min.js | uglifyjs -mt > minified/min.js
zip -r9 minified.zip minified
rm -rf minified
